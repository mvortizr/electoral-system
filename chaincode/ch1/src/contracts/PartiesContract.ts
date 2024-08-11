import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { electoralRollType } from '../models/electoralRollType';
import { Party } from '../models/party';

// @Object()
// export class Party {

//     @Property()
//     public electoralRollType: electoralRollType;

//     @Property()
//     public partyID: string;

//     @Property()
//     public externalPartyID: string;

//     @Property()
//     public partyName: string;

// }


@Info({title: 'Parties contract', description: 'Smart contract for parties'})
export class PartiesContract extends Contract {
    @Transaction()
    public async createParty(ctx: Context, 
        partyID: string, 
        externalPartyID: string,
        partyName: string
    ): Promise<void> {
      
        const newParty : Party = {
            electoralRollType: electoralRollType.PARTY, 
            partyID: partyID,
            externalPartyID: externalPartyID,
            partyName: partyName
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(partyID, Buffer.from(stringify(newParty)));
    }

}