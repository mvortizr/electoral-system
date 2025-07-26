import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { electoralRollType } from '../models/electoralRollType';
import { bringElectionConfig } from '../validations/general/bringElectionConfig';
import { isExternalCandidateIDDuplicated } from '../validations/candidates/noDuplicatedExternalID';
import { doesPositionExists } from '../validations/general/checkIfPositionExists';
//import { doesPartyExists } from '../validations/candidates/checkIfPartyExists';
import { getInternalPartyID } from '../validations/candidates/getInternalPartyID';




@Info({title: 'Candidates contract', description: 'Smart contract for candidates'})
export class CandidatesContract extends Contract {
    // create a new candidate
    @Transaction()
    @Returns('string')
    public async createCandidate(ctx: Context, 
        candidateID: string, 
        candidateInfo: string

    ): Promise<string> {
        // parsing candidate info
        let data = JSON.parse(candidateInfo)

        //// VALIDATIONS

        // check that election config exists and bring the number of parties
        let electionConfig = await bringElectionConfig(ctx);
        if (electionConfig.length === 0) {
            return JSON.stringify({success: false, error:`election config not set`});
        } 

        // check all parties are inputed before starting with positions
        let currentPartiesMissing = electionConfig[0].parties
        let currentPositionMissing = electionConfig[0].positions
        if (currentPartiesMissing >0) {
            return JSON.stringify({success: false, error: "please input all the parties before introducing candidate data" });
        }
        if (currentPositionMissing>0) {
            return JSON.stringify({success: false, error: "please input all the positions before introducing candidate data" });
        }

         // check to not input more candidates than the ones in the config
         let currentCandidateLimit = electionConfig[0].candidates
         if (currentCandidateLimit <=0) {
             return JSON.stringify({success: false, error: "max candidate limit reached" });
         }
 
         //check that there's not another candidate with the same extID
         let doesExtCandIDExists = await isExternalCandidateIDDuplicated(data, ctx)
         if (doesExtCandIDExists === true) {
             return JSON.stringify({success: false, error:`candidate ID ${data.candidateExternalID} already exists`});
         }


         //for every postulation
         let postulations = data.postulations

        
         for (const post of postulations) {
             //check that position exists
            let position = await doesPositionExists(post.positionExternalID, ctx);
            if (!position) {
                return JSON.stringify({success: false, error:`Position ID ${post.positionExternalID} doesn't exists`});
            }
            post.positionInternalID = position.positionID

            //check that party exists
            if (post.partyExternalID != null) {
                let {partyExists, partyInternalID} = await getInternalPartyID(post.partyExternalID, ctx);

                //get internal party ID
                if (!partyExists) {
                    return JSON.stringify({success: false, error:`Party ID ${post.partyExternalID} doesn't exists`});
                }

                post.partyInternalID = partyInternalID
            } 
         }

 
         // all in order, take one from the limit of candidates 
           let newElectionConfigRunningCopy = {
             ...electionConfig[0],
             candidates : currentCandidateLimit-1
         }
         await ctx.stub.putState("2", Buffer.from(stringify(newElectionConfigRunningCopy)));
 

        //////////CREATE CANDIDATE/////////// 

        
        const newCandidate = {
            candidateID: candidateID,
            electoralRollType: electoralRollType.CANDIDATE,
            creationDate: new Date().toISOString(),
            ...data
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(candidateID, Buffer.from(stringify(newCandidate)));

        return JSON.stringify({success: true});
    }

     // create candidates in batch
     @Transaction()
     @Returns('string')
     public async createCandidateBatch(ctx: Context, 
         candidates: string, 
     ): Promise<String> {
         const candidatesArray = JSON.parse(candidates); 

        //VALIDATIONS
        // check that election config exists and bring the number of parties
        let electionConfig = await bringElectionConfig(ctx);
        if (electionConfig.length === 0) {
            return JSON.stringify({success: false, error:`election config not set`});
        } 

        // check all parties are inputed before starting with positions
        let currentPartiesMissing = electionConfig[0].parties
        let currentPositionMissing = electionConfig[0].positions
        if (currentPartiesMissing >0) {
            return JSON.stringify({success: false, error: "please input all the parties before introducing position data" });
        }
        if (currentPositionMissing>0) {
            return JSON.stringify({success: false, error: "please input all the positions before introducing candidate data" });
        }

        // check to not input more candidates than the ones in the config
        let currentCandidateLimit = electionConfig[0].candidates
        let numofCandToInput: number = candidatesArray.length
        if (currentCandidateLimit < numofCandToInput ) {
            return JSON.stringify({success: false, error: "max candidate limit reached" });
        }

        for (const candidate of candidatesArray) {
            const { candidateID, ...data } = candidate;
            //check that there's not another candidate with the same extID
            let doesExtCandIDExists = await isExternalCandidateIDDuplicated(data, ctx)
            if (doesExtCandIDExists === true) {
                return JSON.stringify({success: false, error:`candidate ID ${data.candidateExternalID} already exists`});
            }

        // CHECK POSTULATIONS
        let postulations = data.postulations

        
        for (const post of postulations) {
             //check that position exists
            let position = await doesPositionExists(post.positionExternalID, ctx);
            if (!position) {
                return JSON.stringify({success: false, error:`Position ID ${post.positionExternalID} doesn't exists`});
            }
            //check that party exists
            if (post.partyExternalID != null) {
                let {partyExists, partyInternalID} = await getInternalPartyID(post.partyExternalID, ctx);

                //get internal party ID
                if (!partyExists) {
                    return JSON.stringify({success: false, error:`Party ID ${post.partyExternalID} doesn't exists`});
                }

                post.partyInternalID = partyInternalID
            } 
         }

        }


        ///// CREATE CANDIDATES

        // take one from the limit of candidates 
        let newElectionConfigRunningCopy = {
            ...electionConfig[0],
            candidates : currentCandidateLimit-numofCandToInput
        }

        await ctx.stub.putState("2", Buffer.from(stringify(newElectionConfigRunningCopy)));

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

        return JSON.stringify({success: true});
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