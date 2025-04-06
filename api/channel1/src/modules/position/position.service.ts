import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DTOPosition } from './dtos/dto_position';

@Injectable()
export class PositionService {

    checkUniquePositionIDs(positions: DTOPosition[]): boolean {
        const positionIDS = positions.map(position => position.positionID);
        const uniquePositionIDs = new Set(positionIDS);
    
        // If the size of the set is equal to the length of the array, all IDs are unique
        return uniquePositionIDs.size === positions.length;
    }

}
