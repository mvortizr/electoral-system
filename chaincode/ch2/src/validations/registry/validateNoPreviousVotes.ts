export const didElectorVoteForPosition = async (electorID, positionID, ctx) => {
    
        const queryString = {
            selector: {
                electorID: electorID,
                positionID: positionID
            }
        };

        // Perform the query
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

        const registry: any[] = [];

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
            registry.push(record);
            result = await iterator.next();
        }

        // Close the iterator
        await iterator.close();

        
        if (registry.length > 0) {
            return true
        } 

        return false

}