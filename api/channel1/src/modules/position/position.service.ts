import { Injectable } from '@nestjs/common';
import { TiebreakerConfigItem } from './dtos/tiebreaker';
import { v4 as uuidv4 } from 'uuid';
import { DTOPosition } from './dtos/dto_position';

@Injectable()
export class PositionService {
    
    checkUniqueTiebreakers(tiebreakers: TiebreakerConfigItem[]): boolean {
        const tiebreakerIDs = tiebreakers.map(tiebreaker => tiebreaker.tiebreakerID);
        const uniqueTiebreakers = new Set(tiebreakerIDs)
        return tiebreakerIDs.length === uniqueTiebreakers.size
    }

    checkUniquePositionIDs(positions: DTOPosition[]): boolean {
        const positionIDS = positions.map(position => position.positionID);
        const uniquePositionIDs = new Set(positionIDS);
    
        // If the size of the set is equal to the length of the array, all IDs are unique
        return uniquePositionIDs.size === positions.length;
    }

    processTieBreaker( tiebreakers: TiebreakerConfigItem[]): TiebreakerConfigItem[] {
        tiebreakers.forEach(item => {
            // Generate a new UUID for tiebreakerID
            const newUUID = uuidv4();
            
            // Update the item
            item.tiebreakerExternalID = item.tiebreakerID;
            item.tiebreakerID = newUUID;
             // Assign the old tiebreakerID to tiebreakerExternalID
        });

        return tiebreakers;

    }
}
