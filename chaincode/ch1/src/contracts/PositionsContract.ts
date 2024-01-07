import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { Position } from '../models/position';
import { electoralRollType } from '../models/electoralRollType';

@Info({title: 'Positions Contract', description: 'Smart contract for handling voting positions'})
export class PositionsContract extends Contract {
    
    //TODO, does asset exist?

    //Only used to test chaincode
    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        const positions: Position[] = [
            {
                electoralRollType: electoralRollType.POSITION, 
                positionID: 'position1',
                positionName: 'President'
            },
            {
                electoralRollType: electoralRollType.POSITION, 
                positionID: 'position2',
                positionName: 'Vice President'
            },
            {
                electoralRollType: electoralRollType.POSITION, 
                positionID: 'position3',
                positionName: 'Secretary'
            },
            {
                electoralRollType: electoralRollType.POSITION, 
                positionID: 'position4',
                positionName: 'Treasurer'
            },
            {
                electoralRollType: electoralRollType.POSITION, 
                positionID: 'position5',
                positionName: 'Auditor'
            },
            {
                electoralRollType: electoralRollType.POSITION, 
                positionID: 'position6',
                positionName: 'PRO'
            },
        ];

        for (const position of positions) {
            await ctx.stub.putState(position.positionID, Buffer.from(stringify(position)));
            console.info(`Asset ${position.positionID} initialized`);
        }
    }

    // create a new Position
    @Transaction()
    public async createPosition(ctx: Context, positionID: string, positionName: string): Promise<void> {
      
        const newPosition = {
            electoralRollType: electoralRollType.POSITION, 
            positionID: positionID,
            positionName: positionName
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(positionID, Buffer.from(stringify(newPosition)));
    }

    //TODO move to electoral roll contract
    @Transaction(false)
    @Returns('string')
    public async readEntireElectoralChannel(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
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
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

}