import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';


@Info({title: 'Result Registry Contract', description: 'Smart contract to handle results'})
export class ResultContract extends Contract {
    @Transaction()
    @Returns('string')
    public async queryVotesWithPagination(
        ctx: Context, 
        params: string
    ): Promise<string> {
        const {pageSize, bookmark} = JSON.parse(params)
        const { iterator, metadata } = await ctx.stub.getStateByRangeWithPagination(
            "", //no start key
            "", //no end key
            pageSize,
            bookmark
          );
        
          const results: any[] = [];
          let result = await iterator.next();
        
          while (!result.done) {
            if (result.value && result.value.value.toString()) {
              const record = JSON.parse(result.value.value.toString());
              results.push(record);
            }
            result = await iterator.next();
          }
          await iterator.close();
        
          return JSON.stringify({
            records: results,
            fetchedRecordsCount: metadata.fetchedRecordsCount,
            bookmark: metadata.bookmark
          });
    }

}
