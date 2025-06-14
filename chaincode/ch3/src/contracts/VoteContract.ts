import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
//import { electoralRollType } from '../models/electoralRollType';
//import { voteRegistryType } from '../models/voteRegistryType';

@Info({title: 'Vote Registry Contract', description: 'Smart contract to record votes, partial and final tallies'})
export class VoteContract extends Contract {

    //Adds voter registry
    @Transaction()
    @Returns('string')
    public async createVote(ctx: Context, 
        registryID: string, 
        registryData: string,
       
    ): Promise<String> {
        let data = JSON.parse(registryData)

        const newVoteRegistry = {
            registryID: registryID,
           ...data
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(registryID, Buffer.from(stringify(newVoteRegistry)));
   
        return JSON.stringify({success: true});
    }
    

}