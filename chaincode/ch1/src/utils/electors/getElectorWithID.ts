export const getElectorWithID = async (electorExtID, ctx) => {
    
        const queryString = {
            selector: {
                electorExternalID: electorExtID
            }
        };

        // Perform the query
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

        const elector: any[] = [];

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
            elector.push(record);
            result = await iterator.next();
        }

        // Close the iterator
        await iterator.close();

        return elector

}