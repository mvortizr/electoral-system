import { electoralRollType } from "../../models/electoralRollType";

export const getPartyWithID = async (partyExternalID, ctx) => {
    
    const queryString = {
        selector: {
            partyExternalID: partyExternalID,
            electoralRollType: electoralRollType.PARTY
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

    return party

}