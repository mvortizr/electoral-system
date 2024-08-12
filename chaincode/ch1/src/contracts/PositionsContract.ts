import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { Position } from '../models/position';
import { electoralRollType } from '../models/electoralRollType';
import { TiebreakerConfig } from '../models/tiebreaker';

@Info({title: 'Position Contract', description: 'Smart contract for positions'})
export class PositionContract extends Contract {
    // create a new Position
    @Transaction()
    public async createPosition(ctx: Context, 
        positionID: string, 
        positionInfo: string

    ): Promise<void> {
        let data = JSON.parse(positionInfo)
        const newPosition = {
            positionID: positionID,
            electoralRollType: electoralRollType.POSITION,
            creationDate: new Date().toISOString(),
            ...data
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(positionID, Buffer.from(stringify(newPosition)));
    }

    // create a positions in batch
    @Transaction()
    public async createPositionsBatch(ctx: Context, 
        positions: string, 
    ): Promise<void> {
        const positionsArray = JSON.parse(positions); // Assuming `positions` is a JSON array string

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