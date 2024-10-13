import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { electoralRollType } from '../models/electoralRollType';
import { voteRegistryType } from '../models/voteRegistryType';

@Info({title: 'Vote Registry Contract', description: 'Smart contract for registering which people already voted for a position'})
export class VoteRegistryContract extends Contract {

    //Vote registry
    // Registry ID
    // Votante ID
    // Votante Posicion por la que voto 



    //Adds voter registry
    @Transaction()
    public async createVoteRegistry(ctx: Context, 
        registryID: string, 
        electorExtID: string,
        postulationExtID: string,
    ): Promise<void> {
        
        // TODO: search for internal id's
        const newVoteRegistry = {
            registryID: registryID,
           // electorIntID: electorIntID,
            electorExtID: electorExtID,
            postulationExtID: postulationExtID,
           // postulationIntID: postulationIntID,
            voteRegistryType: voteRegistryType.VOTE_REGISTRY,
            creationDate: new Date().toISOString(),
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(registryID, Buffer.from(stringify(newVoteRegistry)));
    }

    // Read registry paginated 
    @Transaction()
     @Returns('string')
     public async queryVoterRegistry(ctx: Context, params: string): Promise<string> {
         const {pageSize, bookmark} = JSON.parse(params)
         // Create a query string to filter by electoralRollType
         const queryString = {
             selector: {
                voteRegistryType: voteRegistryType.VOTE_REGISTRY
             },
            // sort: [{ "creationDate": "desc" }]  // Sort by creation date in descending order
         };
     
         // Perform the paginated query using getQueryResultWithPagination
         const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(JSON.stringify(queryString), pageSize, bookmark);
     
         const vote_registries: any[] = [];
 
         let result = await iterator.next();
         while (!result.done) {
             const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
             let record;
             try {
                 record = JSON.parse(strValue);
             } catch (err) {
                 console.log(err);
                 record = strValue;
             }
             vote_registries.push(record);
             result = await iterator.next();
         }
     
         return JSON.stringify({
             voteRegistries: vote_registries,
             bookmark: metadata.bookmark  // Return the bookmark for the next page
         });
     }
    

}