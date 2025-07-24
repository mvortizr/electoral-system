import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { voteResultType } from '../models/voteRegistryType';

@Info({title: 'Vote Result Contract', description: 'Smart contract to record votes, partial and final tallies'})
export class VoteResultContract extends Contract {

    //Adds voter registry
    @Transaction()
    @Returns('string')
    public async createVote(ctx: Context, 
        registryID: string, 
        registryData: string,
       
    ): Promise<String> {
        let data = JSON.parse(registryData)

        const newVoteRegistry = {
            registryID: registryID,
            voteResultType: voteResultType.VOTE,
           ...data
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(registryID, Buffer.from(stringify(newVoteRegistry)));
   
        return JSON.stringify({success: true});
    }

    @Transaction()
    @Returns('string')
    public async makeVotePrecount(ctx: Context): Promise<string> {
        const iterator = await ctx.stub.getStateByRange('', '');
        const batchSize = 500;
        let voteCountInBatch = 0;
        let batchIndex = 1;
    
        let precountMap: Record<string, any> = {};
    
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString());
    
                if (record.voteResultType === voteResultType.VOTE) {
                    const multiplier = record.multiplier ?? 1;
    
                    const positionID = record.positionID;
                    const candidateID = record.candidateID;
                    const partyID = record.partyID || 'None';
    
                    const key = `pos${positionID}_cand${candidateID}_party${partyID}`;
    
                    if (!precountMap[key]) {
                        precountMap[key] = {
                            totalVotes: 0,
                            info: {
                                positionID,
                                positionName: record.positionName,
                                candidateID,
                                candidateFullName: record.candidateFullName,
                                postulationID: record.postulationID,
                                partyID: record.partyID ?? 'None',
                                partyName: record.partyName ?? 'None',
                                partyExtID: record.partyExtID?? 'None',
                                positionExtID: record.positionExtID,
                                postulationExtID: record.postulationExtID,
                                candidateExtID: record.candidateExtID,
                            },
                        };
                    }
    
                    precountMap[key].totalVotes += multiplier;
                    voteCountInBatch++;
                }
            }
    
            if (res.done || voteCountInBatch === batchSize) {
                // Write all group entries as separate world state keys
                for (const key in precountMap) {
                    const fullKey = `partial_precount${batchIndex}_${key}`;
                    await ctx.stub.putState(fullKey, Buffer.from(JSON.stringify(precountMap[key])));
                }
    
                batchIndex++;
                voteCountInBatch = 0;
                precountMap = {};
    
                if (res.done) break;
            }
        }
    
        return JSON.stringify({ success: true, message: 'Vote precount complete.' });
    }


    @Transaction()
    @Returns('string')
    public async makeFinalVoteCount(ctx: Context): Promise<string> {
        const iterator = await ctx.stub.getStateByRange('', '');
        const finalCountMap: Record<string, any> = {};
    
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.key.startsWith('partial_precount')) {
                const partialKey = res.value.key;
                const data = JSON.parse(res.value.value.toString());
    
                // Extract the meaningful group key
                const groupKey = partialKey.split('partial_precount')[1]; // e.g. "1_posxxx_candxxx_partyxxx"
                const normalizedKey = groupKey.replace(/^(\d+)_/, '');     // removes batch index (e.g., "posxxx_candxxx_partyxxx")
    
                if (!finalCountMap[normalizedKey]) {
                    finalCountMap[normalizedKey] = {
                        totalVotes: 0,
                        info: data.info
                    };
                }
    
                finalCountMap[normalizedKey].totalVotes += data.totalVotes;
            }
    
            if (res.done) break;
        }
    
        
        await ctx.stub.putState(
            'final_result',
            Buffer.from(JSON.stringify(finalCountMap))
        );
    
        return JSON.stringify({ success: true, results: finalCountMap });
    }

    @Transaction(false)
    @Returns('string') //Read only method to get the final result
    public async getFinalResult(ctx: Context): Promise<string> {
        const resultBuffer = await ctx.stub.getState('final_result');
    
        if (!resultBuffer || resultBuffer.length === 0) {
            return JSON.stringify({ success: false, message: 'No final result found.' });
        }
    
        const finalResult = JSON.parse(resultBuffer.toString());
    
        return JSON.stringify({ success: true, results: finalResult });
    }
    

}