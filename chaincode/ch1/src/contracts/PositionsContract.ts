import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { Position } from '../models/position';
import { electoralRollType } from '../models/electoralRollType';
import { TiebreakerConfig } from '../models/tiebreaker';
import { bringElectionConfig } from '../validations/general/bringElectionConfig';
import { isExternalPositionIDDuplicated } from '../validations/position/noDuplicatedExternalID';



@Info({title: 'Position Contract', description: 'Smart contract for positions'})
export class PositionContract extends Contract {
    // create a new Position
    @Transaction()
    @Returns('string')
    public async createPosition(ctx: Context, 
        positionID: string, 
        positionInfo: string

    ): Promise<String> {

        let data = JSON.parse(positionInfo)

        // check that election config exists 
        let electionConfig = await bringElectionConfig(ctx);
        if (electionConfig.length === 0) {
            return JSON.stringify({success: false, error:`election config not set`});
        } 

        // check all parties are inputed before starting with positions
        let currentPartiesMissing = electionConfig[0].parties
        if (currentPartiesMissing >0) {
            return JSON.stringify({success: false, error: "please input all the parties before introducing position data" });
        }

        // check to not input more positions than the ones in the config
        let currentPositionLimit = electionConfig[0].positions 
        if (currentPositionLimit <=0) {
            return JSON.stringify({success: false, error: "max position limit reached" });
        }

        //check that there's not another position with the same extID
        let doesExternalPosIDExists = await isExternalPositionIDDuplicated(data, ctx)
        if (doesExternalPosIDExists === true) {
            return JSON.stringify({success: false, error:`party ID ${data.positionExternalID} already exists`});
        }


        // take one from the limit of parties 
          let newElectionConfigRunningCopy = {
            ...electionConfig[0],
            positions : currentPositionLimit-1
        }
        await ctx.stub.putState("2", Buffer.from(stringify(newElectionConfigRunningCopy)));

       

        // create the position
        const newPosition = {
            positionID: positionID,
            electoralRollType: electoralRollType.POSITION,
            creationDate: new Date().toISOString(),
            ...data
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(positionID, Buffer.from(stringify(newPosition)));
    
        return JSON.stringify({success: true});

    }

    // create a positions in batch
    @Transaction()
    @Returns('string')
    public async createPositionsBatch(ctx: Context, 
        positions: string, 
    ): Promise<string> {
        const positionsArray = JSON.parse(positions); // Assuming `positions` is a JSON array string

        // check that election config exists and bring the number of parties
        let electionConfig = await bringElectionConfig(ctx);
        if (electionConfig.length === 0) {
            return JSON.stringify({success: false, error:`election config not set`});
        } 

        // check all parties are inputed before starting with positions
        let currentPartiesMissing = electionConfig[0].parties
        if (currentPartiesMissing >0) {
            return JSON.stringify({success: false, error: "please input all the parties before introducing position data" });
        }

        // check to not input more positions than the ones in the config
        let currentPositionLimit = electionConfig[0].positions 
        let numofPositionsToInput: number = positionsArray.length
        
        if (currentPositionLimit < numofPositionsToInput) {
            return JSON.stringify({success: false, error: "max position limit reached" });
        }

        //check there is not another position with same extID
        for (const position of positionsArray) {
            const { positionID, ...data } = position;
            let doesExternalPosIDExists = await isExternalPositionIDDuplicated(data, ctx)
            if (doesExternalPosIDExists === true) {
                return JSON.stringify({success: false, error:`position ID ${data.positionExternalID} already exists`});
            }
        }

        // take one from the limit of parties 
        let newElectionConfigRunningCopy = {
            ...electionConfig[0],
            positions : currentPositionLimit-numofPositionsToInput
        }
        await ctx.stub.putState("2", Buffer.from(stringify(newElectionConfigRunningCopy)));


        for (const position of positionsArray) {
            const { positionID, ...data } = position;
            const newPosition = {
                positionID: positionID,
                electoralRollType: electoralRollType.POSITION,
                creationDate: new Date().toISOString(),
                ...data
            };

            // Insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            await ctx.stub.putState(positionID, Buffer.from(stringify((newPosition))));
        }

        return JSON.stringify({success: true});
    }

    

    @Transaction()
    @Returns('string')
    public async queryPositionsWithPagination(ctx: Context, params: string): Promise<string> {
        const {pageSize, bookmark} = JSON.parse(params)
        // Create a query string to filter by electoralRollType
        const queryString = {
            selector: {
                electoralRollType: electoralRollType.POSITION
            },
           // sort: [{ "creationDate": "desc" }]  // Sort by creation date in descending order
        };
    
        // Perform the paginated query using getQueryResultWithPagination
        const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(JSON.stringify(queryString), pageSize, bookmark);
    
        const positions: any[] = [];

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
            positions.push(record);
            result = await iterator.next();
        }
    
        return JSON.stringify({
            positions: positions,
            bookmark: metadata.bookmark  // Return the bookmark for the next page
        });
    }

    @Transaction()
    @Returns('string')
    public async queryPositionByExternalID(ctx: Context, externalID: string): Promise<string> {
        // Create a query string to filter by the "camp" field
        const queryString = {
            selector: {
                positionExternalID: externalID
                //electoralRollType: electoralRollType.POSITION  // Optional: If you also want to filter by electoralRollType
            }
        };

        // Perform the query
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

        const positions: any[] = [];

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
            positions.push(record);
            result = await iterator.next();
        }

        // Close the iterator
        await iterator.close();

        // Return the positions as a JSON string
        return JSON.stringify(positions);
    }

}