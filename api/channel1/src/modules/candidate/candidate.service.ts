import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PostulationDTO } from './dtos/dto_postulation';
import { CandidateDTO } from './dtos/dto_candidate';

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

    checkUniqueCandidateIDs(candidates: CandidateDTO[]): boolean {
        const candidatesIDs = candidates.map(candidate => candidate.candidateID);
        const uniqueCandidateIDs = new Set(candidatesIDs);
    
        // If the size of the set is equal to the length of the array, all IDs are unique
        return uniqueCandidateIDs.size === candidatesIDs.length;
    }
}