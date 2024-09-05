export const isExternalPartyIDDuplicated = async (partyData, ctx) => {
    const partyExternalID = partyData.partyExternalID;
        const queryString = {
            selector: {
                partyExternalID: partyExternalID
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

        // Check if any party was found with the same externalID
        if (party.length > 0) {
            return true
        } 

        return false

}