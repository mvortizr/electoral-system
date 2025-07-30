import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';

@Info({title: 'Channel Contract', description: 'Get all assets with pagination'})
export class ExplorerContract extends Contract {

    @Transaction()
    @Returns('string')
    public async getAllAssetsWithPagination(ctx: Context, params: string): Promise<string> {
        const {pageSize, bookmark} = JSON.parse(params);

        // Traer todos los documentos con selector vacío
        const queryString = { selector: {} };

        const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(JSON.stringify(queryString), pageSize, bookmark);

        const data: any[] = [];

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
            data.push(record);
            result = await iterator.next();
        }

        return JSON.stringify({
            data: data,
            bookmark: metadata.bookmark
        });
    }


}
