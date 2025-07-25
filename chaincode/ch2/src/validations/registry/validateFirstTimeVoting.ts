import { voteRegistryType } from '../../models/voteRegistryType';

export const isElectorFirstTimeVoting = async (electorIntID, ctx) => {
    const query = {
        selector: {
            electorID: electorIntID,
            voteRegistryType: voteRegistryType.VOTE_REGISTRY_UNIQUE
        }
    };
    
    const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    
    const results: any[] = [];
    while (true) {
        const res = await iterator.next();
        if (res.value && res.value.value.toString()) {
            results.push(JSON.parse(res.value.value.toString()));
        }
        if (res.done) break;
    }
    await iterator.close();
    
    return results.length === 0;
    
}