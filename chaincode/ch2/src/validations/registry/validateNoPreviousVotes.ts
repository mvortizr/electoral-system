export const didElectorVoteForPosition = async (electorID, positionID, vacancy, ctx) => {
    const queryString = {
        selector: {
            electorID: electorID,
            positionID: positionID
        }
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

    let voteCount = 0;

    let result = await iterator.next();
    while (!result.done) {
        try {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            JSON.parse(strValue); 
            voteCount++;
        } catch (err) {
            console.log('Error parsing vote record:', err);
        }
        result = await iterator.next();
    }

    await iterator.close();

    // Return true if they already voted the maximum allowed times
    return voteCount >= vacancy;
};
