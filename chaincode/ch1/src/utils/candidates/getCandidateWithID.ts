export const getCandidateWithID = async (candidateExtID, ctx) => {
    
        const queryString = {
            selector: {
                candidateExternalID: candidateExtID
            }
        };

        // Perform the query
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

        const candidate: any[] = [];

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
            candidate.push(record);
            result = await iterator.next();
        }

        // Close the iterator
        await iterator.close();

        return candidate

}