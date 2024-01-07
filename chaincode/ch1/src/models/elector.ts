
import {Object, Property} from 'fabric-contract-api';
import { electoralRollType } from './electoralRollType';

@Object()
export class Elector {

    @Property()
    public electoralRollType: electoralRollType;

    @Property()
    public electorID: string;

    @Property()
    public electorFirstName: string;

    @Property()
    public electorSecondName: string;

    @Property()
    public electorFirstLastName: string;

    @Property()
    public electorSecondLastName: string;

    public positionsToVote: Array<string>; //ID's of the positions the elector can vote for 


}
