import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PostulationDTO } from './dtos/dto_postulation';


@Injectable()
export class CandidateService {
    processPostulations( postulations: PostulationDTO[]): PostulationDTO[] {
        postulations.forEach(item => {
            // Generate a new UUID for tiebreakerID
            const newUUID = uuidv4();
            item.postulationExternalID = item.positionID
            item.postulationID = newUUID
        });

        return postulations;

    }
}