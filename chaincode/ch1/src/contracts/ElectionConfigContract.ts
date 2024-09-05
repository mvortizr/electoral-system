import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { electoralRollType } from '../models/electoralRollType';

@Info({title: 'Config contract', description: 'Smart contract for handling election configuration'})
export class ElectionConfigContract extends Contract {

    // create a new Position
    @Transaction()
    public async setElectionConfig(ctx: Context, numParties: number, numPositions: number, numCandidates:number, numElectors:number): Promise<void> {
      
        const newElectionConfig = {
            "parties": numParties,
            "electoralRollType": electoralRollType.CONFIG,
            "positions": numPositions,
            "candidates": numCandidates,
            "electors": numElectors
        };

        const newElectionConfigRunningCopy = {
            "parties": numParties,
            "electoralRollType": electoralRollType.CONFIGCOUNTER,
            "positions": numPositions,
            "candidates": numCandidates,
            "electors": numElectors

        }
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState("1", Buffer.from(stringify(newElectionConfig)));
        await ctx.stub.putState("2", Buffer.from(stringify(newElectionConfigRunningCopy)));
    }

    @Transaction()
    public testConnection(ctx: Context): string {
        return "{\"message\": \"Successfully Connected\"}"
    }

}