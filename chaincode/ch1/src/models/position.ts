
import {Object, Property} from 'fabric-contract-api';
import { electoralRollType } from './electoralRollType';

@Object()
export class Position {
    @Property()
    public electoralRollType: electoralRollType;
    
    @Property()
    public positionID: string;

    @Property()
    public positionName: string;

}
