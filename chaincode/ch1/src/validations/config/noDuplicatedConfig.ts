import { electoralRollType } from "../../models/electoralRollType";

export const isElectionConfigDuplicated = async (ctx) => {
    
        const queryString = {
            selector: {
                electoralRollType: "config"
            }
        };

        // Perform the query
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));

        const config: any[] = [];

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
            config.push(record);
            result = await iterator.next();
        }

        // Close the iterator
        await iterator.close();

        // Check if any party was found with the same externalID
        if (config.length > 0) {
            return true
        } 

        return false

}