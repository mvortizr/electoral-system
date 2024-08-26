import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { electoralRollType } from '../models/electoralRollType';



@Info({title: 'Candidates contract', description: 'Smart contract for candidates'})
export class CandidatesContract extends Contract {
    // create a new candidate
    @Transaction()
    public async createCandidate(ctx: Context, 
        candidateID: string, 
        candidateInfo: string

    ): Promise<void> {
        let data = JSON.parse(candidateInfo)
        const newCandidate = {
            candidateID: candidateID,
            electoralRollType: electoralRollType.CANDIDATE,
            creationDate: new Date().toISOString(),
            ...data
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(candidateID, Buffer.from(stringify(newCandidate)));
    }

     // create candidates in batch
     @Transaction()
     public async createCandidateBatch(ctx: Context, 
         candidates: string, 
     ): Promise<void> {
         const candidatesArray = JSON.parse(candidates); 
 
         for (const candidate of candidatesArray) {
             const { candidateID, ...data } = candidate;
             const newCandidate = {
                 candidateID: candidateID,
                 electoralRollType: electoralRollType.CANDIDATE,
                 creationDate: new Date().toISOString(),
                 ...data
             };
 
             // Insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
             await ctx.stub.putState(candidateID, Buffer.from(stringify((newCandidate))));
         }
     }

     @Transaction()
     @Returns('string')
     public async queryCandidatesWithPagination(ctx: Context, params: string): Promise<string> {
         const {pageSize, bookmark} = JSON.parse(params)
         // Create a query string to filter by electoralRollType
         const queryString = {
             selector: {
                 electoralRollType: electoralRollType.CANDIDATE
             },
            // sort: [{ "creationDate": "desc" }]  // Sort by creation date in descending order
         };
     
         // Perform the paginated query using getQueryResultWithPagination
         const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(JSON.stringify(queryString), pageSize, bookmark);
     
         const candidates: any[] = [];
 
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
             candidates.push(record);
             result = await iterator.next();
         }
     
         return JSON.stringify({
             candidates: candidates,
             bookmark: metadata.bookmark  // Return the bookmark for the next page
         });
     }
 
     @Transaction()
     @Returns('string')
     public async queryCandidatesByExtID(ctx: Context, externalID: string): Promise<string> {
         // Create a query string to filter by the "camp" field
         const queryString = {
             selector: {
                 candidateExternalID: externalID
                 //electoralRollType: electoralRollType.POSITION  // Optional: If you also want to filter by electoralRollType
             }
         };
 
         // Perform the query
         const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
 
         const candidates: any[] = [];
 
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
             candidates.push(record);
             result = await iterator.next();
         }
 
         // Close the iterator
         await iterator.close();
 
         // Return the positions as a JSON string
         return JSON.stringify(candidates);
     }





}