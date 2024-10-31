import { Injectable } from '@nestjs/common';
import { ElectorDTO } from './dtos/elector_dto';

@Injectable()
export class ElectorService {
    checkUniqueElectorIDs(electors: ElectorDTO[]): boolean {
        const electorIDs = electors.map(elector => elector.electorID);
        const uniqueElectorIDs = new Set(electorIDs);
    
        // If the size of the set is equal to the length of the array, all IDs are unique
        return uniqueElectorIDs.size === electorIDs.length;
    }
}