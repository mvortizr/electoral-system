import { Injectable } from '@nestjs/common';
import { TiebreakerConfigItem } from './dtos/tiebreaker';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PositionService {
    
    checkUniqueTiebreakers(tiebreakers: TiebreakerConfigItem[]): boolean {
        const tiebreakerIDs = tiebreakers.map(tiebreaker => tiebreaker.tiebreakerID);
        const uniqueTiebreakers = new Set(tiebreakerIDs)
        return tiebreakerIDs.length === uniqueTiebreakers.size
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
