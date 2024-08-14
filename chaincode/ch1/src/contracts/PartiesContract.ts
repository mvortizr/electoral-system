import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { electoralRollType } from '../models/electoralRollType';



@Info({title: 'Parties contract', description: 'Smart contract for parties'})
export class PartiesContract extends Contract {
    @Transaction()
    public async createParty(ctx: Context, 
        partyID: string, 
        partyInfo: string
    ): Promise<void> {
        let data = JSON.parse(partyInfo)
      
        const newParty  = {
            electoralRollType: electoralRollType.PARTY, 
            partyID: partyID,
            creationDate: new Date().toISOString(),
            ...data
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(partyID, Buffer.from(stringify(newParty)));
    }

    @Transaction()
    public async createPartyBatch(ctx: Context, 
        parties: string, 
    ): Promise<void> {
        const partiesArray = JSON.parse(parties); // Assuming `positions` is a JSON array string

        for (const party of partiesArray) {
            const { partyID, ...data } = party;
            const newParty = {
                partyID: partyID,
                electoralRollType: electoralRollType.PARTY,
                creationDate: new Date().toISOString(),
                ...data
            };

            // Insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            await ctx.stub.putState(partyID, Buffer.from(stringify((newParty))));
        }
    }

    @Transaction()
    @Returns('string')
    public async queryPartiesWithPagination(ctx: Context, params: string): Promise<string> {
        const {pageSize, bookmark} = JSON.parse(params)
        // Create a query string to filter by electoralRollType
        const queryString = {
            selector: {
                electoralRollType: electoralRollType.PARTY
            },
           // sort: [{ "creationDate": "desc" }]  // Sort by creation date in descending order
        };
    
        // Perform the paginated query using getQueryResultWithPagination
        const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(JSON.stringify(queryString), pageSize, bookmark);
    
        const parties: any[] = [];

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
            parties.push(record);
            result = await iterator.next();
        }
    
        return JSON.stringify({
            parties: parties,
            bookmark: metadata.bookmark  // Return the bookmark for the next page
        });
    }

    @Transaction()
    @Returns('string')
    public async queryPartyByExternalID(ctx: Context, externalID: string): Promise<string> {
        // Create a query string to filter by the "camp" field
        const queryString = {
            selector: {
                partyExternalID: externalID
                //electoralRollType: electoralRollType.POSITION  // Optional: If you also want to filter by electoralRollType
            }
        };

        // Perform the query
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

        const party: any[] = [];

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
            party.push(record);
            result = await iterator.next();
        }

        // Close the iterator
        await iterator.close();

        // Return the positions as a JSON string
        return JSON.stringify(party);
    }

}