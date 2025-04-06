
import {Object, Property} from 'fabric-contract-api';
import { electoralRollType } from './electoralRollType';


@Object()
export class Position {
    @Property()
    public electoralRollType: electoralRollType;
    
    @Property()
    public positionID: string;

    @Property()
    public externalPositionID: string;

    @Property()
    public vacancies: number;

    @Property()
    public positionName: string;

}
