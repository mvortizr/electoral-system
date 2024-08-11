
import {Object, Property} from 'fabric-contract-api';
import { electoralRollType } from './electoralRollType';

@Object()
export class Party {

    @Property()
    public electoralRollType: electoralRollType;

    @Property()
    public partyID: string;

    @Property()
    public externalPartyID: string;

    @Property()
    public partyName: string;

}