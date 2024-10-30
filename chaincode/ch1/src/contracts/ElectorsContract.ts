import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { electoralRollType } from '../models/electoralRollType';
import { bringElectionConfig } from '../validations/general/bringElectionConfig';
import { isExtElectorIDDuplicated } from '../validations/electors/noDuplicatedExternalID';
import { doesPositionExists } from '../validations/general/checkIfPositionExists';

@Info({title: 'Electors contract', description: 'Smart contract for electors'})
export class ElectorsContract extends Contract {

    // create a new Elector
    @Transaction()
    @Returns('string')
    public async createElector(ctx: Context, 
        electorID: string, 
        electorInfo: string

    ): Promise<String> {
        let data = JSON.parse(electorInfo)

        //validation
         // check that election config exists 
         let electionConfig = await bringElectionConfig(ctx);
         if (electionConfig.length === 0) {
             return JSON.stringify({success: false, error:`election config not set`});
         } 
 
         // check all parties, position, candidates are inputed before starting with electors
         let currentPartiesMissing = electionConfig[0].parties
         let currentPositionMissing = electionConfig[0].positions
         let currentCandidatesMissing = electionConfig[0].candidates
         if (currentPartiesMissing >0) {
             return JSON.stringify({success: false, error: "please input all the parties before introducing elector data" });
         }
         if (currentPositionMissing>0) {
             return JSON.stringify({success: false, error: "please input all the positions before introducing elector data" });
         }

         if (currentCandidatesMissing>0) {
            return JSON.stringify({success: false, error: "please input all the candidates before introducing elector data" });
        }

        // check to not input more electors than the ones in the config
        let currentElectorLimit = electionConfig[0].electors
        if (currentElectorLimit <=0) {
            return JSON.stringify({success: false, error: "max elector limit reached" });
        }

        //check there isnt another elector with the same ID
        let doesExtIDElectorExists = await isExtElectorIDDuplicated(data, ctx)
         if (doesExtIDElectorExists === true) {
             return JSON.stringify({success: false, error:`elector ID ${data.electorExternalID} already exists`});
         }


        //check all the positions are valid
        let positionsToVote = data.positionsToVote

        for (const post of positionsToVote) {
            let position = await doesPositionExists(post, ctx);
            if (!position) {
                return JSON.stringify({success: false, error:`Position ID ${post} doesn't exists`});
            }
        }

        /// CREATE NEW ELECTOR

         // all in order, take one from the limit of candidates 
         let newElectionConfigRunningCopy = {
            ...electionConfig[0],
            electors : currentElectorLimit-1
        }
        await ctx.stub.putState("2", Buffer.from(stringify(newElectionConfigRunningCopy)));



        const newElector = {
            electorID: electorID,
            electoralRollType: electoralRollType.ELECTOR,
            creationDate: new Date().toISOString(),
            ...data
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(electorID, Buffer.from(stringify(newElector)));

        return JSON.stringify({success: true});
    }

    // create a positions in batch
    @Transaction()
    @Returns('string')
    public async createElectorsBatch(ctx: Context, 
        electors: string, 
    ): Promise<String> {
        const electorsArray = JSON.parse(electors); // Assuming `electors` is a JSON array string

        //validation
         // check that election config exists 
         let electionConfig = await bringElectionConfig(ctx);
         if (electionConfig.length === 0) {
             return JSON.stringify({success: false, error:`election config not set`});
         } 
 
         // check all parties, position, candidates are inputed before starting with electors
         let currentPartiesMissing = electionConfig[0].parties
         let currentPositionMissing = electionConfig[0].positions
         let currentCandidatesMissing = electionConfig[0].candidates
         if (currentPartiesMissing >0) {
             return JSON.stringify({success: false, error: "please input all the parties before introducing elector data" });
         }
         if (currentPositionMissing>0) {
             return JSON.stringify({success: false, error: "please input all the positions before introducing elector data" });
         }

         if (currentCandidatesMissing>0) {
            return JSON.stringify({success: false, error: "please input all the candidates before introducing elector data" });
        }

         // check to not input more electors than the ones in the config
        let currentElectorLimit = electionConfig[0].electors
        let numofElectToInput: number = electorsArray.length
        if (currentElectorLimit < numofElectToInput ) {
            return JSON.stringify({success: false, error: "max elector limit reached" });
        }

        for (const elector of electorsArray) {
            const { electorID, ...data } = elector;
            //check there's not another candidate with the same ID
            let doesExtIDElectorExists = await isExtElectorIDDuplicated(data, ctx)
            if (doesExtIDElectorExists === true) {
                return JSON.stringify({success: false, error:`elector ID ${data.electorExternalID} already exists`});
            }

            //check all the positions are valid
            let positionsToVote = data.positionsToVote

            for (const post of positionsToVote) {
                let position = await doesPositionExists(post, ctx);
                if (!position) {
                    return JSON.stringify({success: false, error:`Position ID ${post} doesn't exists`});
                }
            }
        }

        //CREATE ELECTORS

        for (const elector of electorsArray) {
            const { electorID, ...data } = elector;
            const newElector = {
                electorID: electorID,
                electoralRollType: electoralRollType.ELECTOR,
                creationDate: new Date().toISOString(),
                ...data
            };

            // Insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            await ctx.stub.putState(electorID, Buffer.from(stringify((newElector))));
        }

        return JSON.stringify({success: true});
    }

    

    @Transaction()
    @Returns('string')
    public async queryElectorsWithPagination(ctx: Context, params: string): Promise<string> {
        const {pageSize, bookmark} = JSON.parse(params)
        // Create a query string to filter by electoralRollType
        const queryString = {
            selector: {
                electoralRollType: electoralRollType.ELECTOR
            },
           // sort: [{ "creationDate": "desc" }]  // Sort by creation date in descending order
        };
    
        // Perform the paginated query using getQueryResultWithPagination
        const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(JSON.stringify(queryString), pageSize, bookmark);
    
        const electors: any[] = [];

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
            electors.push(record);
            result = await iterator.next();
        }
    
        return JSON.stringify({
            electors: electors,
            bookmark: metadata.bookmark  // Return the bookmark for the next page
        });
    }

    @Transaction()
    @Returns('string')
    public async queryElectorsByExternalID(ctx: Context, externalID: string): Promise<string> {
        // Create a query string to filter by the "camp" field
        const queryString = {
            selector: {
                electorExternalID: externalID
                //electoralRollType: electoralRollType.POSITION  // Optional: If you also want to filter by electoralRollType
            }
        };

        // Perform the query
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

        const electors: any[] = [];

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
            electors.push(record);
            result = await iterator.next();
        }

        // Close the iterator
        await iterator.close();

        // Return the positions as a JSON string
        return JSON.stringify(electors);
    }
   

}