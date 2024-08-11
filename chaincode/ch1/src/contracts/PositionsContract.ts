import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { Position } from '../models/position';
import { electoralRollType } from '../models/electoralRollType';
import { TiebreakerConfig } from '../models/tiebreaker';

@Info({title: 'Position Contract', description: 'Smart contract for positions'})
export class PositionContract extends Contract {
    // create a new Position
    @Transaction()
    public async createPosition(ctx: Context, 
        positionID: string, 
        positionInfo: string

    ): Promise<void> {
        let data = JSON.parse(positionInfo)
        // const newPosition  = {
        //     electoralRollType: electoralRollType.POSITION, 
        //     positionID: positionID,
        //     externalPositionID: externalPositionID,
        //     vacancies: vacancies,
        //     positionName: positionName,
        //     tieBreakerConfig: tieBreakerConfig
        // };
        const newPosition = {
            positionID: positionID,
            ...data
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(positionID, Buffer.from(stringify(newPosition)));
    }

}