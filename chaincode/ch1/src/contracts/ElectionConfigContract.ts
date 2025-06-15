import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { electoralRollType } from '../models/electoralRollType';
import { isElectionConfigDuplicated } from '../validations/config/noDuplicatedConfig';
import { bringElectionConfig } from '../validations/general/bringElectionConfig';

@Info({title: 'Config contract', description: 'Smart contract for handling election configuration'})
export class ElectionConfigContract extends Contract {

    // create a new Position
    @Transaction()
    @Returns('string')
    public async setElectionConfig(ctx: Context, numParties: number, numPositions: number, numCandidates:number, numElectors:number, electionData: string): Promise<String> {
        const parsedElectionData = JSON.parse(electionData);

        //VALIDATIONS
        // does this project have a config already?
        let doesConfigExists = await isElectionConfigDuplicated(ctx)
        if(doesConfigExists === true) {
            return JSON.stringify({success: false, error:`election config already exists`});
        }



        //ALL IN ORDER, CREATE ELECTION CONFIG
        const newElectionConfig = {
            "parties": numParties,
            "electoralRollType": electoralRollType.CONFIG,
            "positions": numPositions,
            "candidates": numCandidates,
            "electors": numElectors,
            ...parsedElectionData
        };

        const newElectionConfigRunningCopy = {
            "parties": numParties,
            "electoralRollType": electoralRollType.CONFIGCOUNTER,
            "positions": numPositions,
            "candidates": numCandidates,
            "electors": numElectors,
            ...parsedElectionData

        }
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState("1", Buffer.from(stringify(newElectionConfig)));
        await ctx.stub.putState("2", Buffer.from(stringify(newElectionConfigRunningCopy)));
        return JSON.stringify({success: true});
    }

    @Transaction()
    public testConnection(ctx: Context): string {
        return "{\"message\": \"Successfully Connected\"}"
    }

    @Transaction()
    @Returns('string')
    public async getMinimunApprovals(ctx: Context): Promise<String> {

        let electionConfig = await bringElectionConfig(ctx);
        
        if (electionConfig.length === 0) {
            return JSON.stringify({success: false, error:`election config not set`});
        } 
        
        
        return JSON.stringify({success: true, minimum_approvals: electionConfig[0].minimum_approvals});
    }



}