import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { electoralRollType } from '../models/electoralRollType';


@Info({title: 'Electors contract', description: 'Smart contract for electors'})
export class ElectorsContract extends Contract {

    // create a new Elector
    @Transaction()
    public async createElector(ctx: Context, 
        electorID: string, 
        electorInfo: string

    ): Promise<void> {
        let data = JSON.parse(electorInfo)
        const newElector = {
            electorID: electorID,
            electoralRollType: electoralRollType.ELECTOR,
            creationDate: new Date().toISOString(),
            ...data
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(electorID, Buffer.from(stringify(newElector)));
    }

    // create a positions in batch
    @Transaction()
    public async createElectorsBatch(ctx: Context, 
        electors: string, 
    ): Promise<void> {
        const electorsArray = JSON.parse(electors); // Assuming `positions` is a JSON array string

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