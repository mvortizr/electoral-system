import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { voteRegistryType } from '../models/voteRegistryType';
import { didElectorVoteForPosition } from '../validations/registry/validateNoPreviousVotes';

@Info({title: 'Vote Registry Contract', description: 'Smart contract for registering which people already voted for a position'})
export class VoteRegistryContract extends Contract {

    //Vote registry
    // Registry ID
    // Votante ID
    // Votante Posicion por la que voto 



    //Adds voter registry
    @Transaction()
    @Returns('string')
    public async createVoteRegistry(ctx: Context, 
        registryID: string, 
        electorIntID: string,
        electorExtID: string,  
        positionIntID: string,
        positionExtID: string
    ): Promise<String> {

        //TODO: change this logic, Search for repeated keys
        let previousVote = await didElectorVoteForPosition(electorIntID,positionIntID, ctx)
        if (previousVote === true) {
            return JSON.stringify({success: false, error:`elector ID ${electorExtID} already voted for position ${positionExtID}`});
        }

        /// TODO: vote registry #2 (unico)
        // lo busco, si no existe lo creo. Luego esto lo contamos el resultado.
        // const newVoteRegistry = {
        //     registryID: registryID,
        //     electorID: electorIntID,
        //     electorExternalID: electorExtID,
        //     positionID: positionIntID,
        //     positionExternalID: positionExtID,
        //     voteRegistryType: voteRegistryType.VOTE_REGISTRY_UNIQUE,
        // }
        
        
        const newVoteRegistry = {
            registryID: registryID,
            electorID: electorIntID,
            electorExternalID: electorExtID,
            positionID: positionIntID,
            positionExternalID: positionExtID,
            voteRegistryType: voteRegistryType.VOTE_REGISTRY,
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(registryID, Buffer.from(stringify(newVoteRegistry)));
        return JSON.stringify({success: true});
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