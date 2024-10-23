import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PostulationDTO } from './dtos/dto_postulation';


@Injectable()
export class CandidateService {
    processPostulations( postulations: PostulationDTO[]): any {
        postulations.forEach(item => {
            // Generate a new UUID for tiebreakerID

            item.postulationExternalID = item.postulationID
            item.postulationID = uuidv4();
            item.partyExternalID = item.partyID
            item.positionExternalID = item.positionID
            delete item.partyID;
            delete item.positionID;
            
            
        });

        return postulations;

    }
}