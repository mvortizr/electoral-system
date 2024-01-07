import {Object, Property} from 'fabric-contract-api';
import { electoralRollType } from './electoralRollType';


@Object()
export class Candidate {
    @Property()
    public electoralRollType: electoralRollType;
    
    @Property()
    public candidateID: string;

    @Property()
    public candidateFirstName: string;

    @Property()
    public candidateSecondName: string;

    @Property()
    public candidateFirstLastName: string;

    @Property()
    public candidateSecondLastName: string;

    @Property()
    public postulatedPositions: Array<string>; //ID's of the positions the candidate is postulated for

    //TODO Base  64 photo

}
