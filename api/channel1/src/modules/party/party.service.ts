import { Injectable } from '@nestjs/common';
import { DTOParty } from './dtos/dto_party';


@Injectable()
export class PartyService {
    checkUniquePartyIDs(partyArray: DTOParty[]): boolean {
        const partyIDs = partyArray.map(party => party.partyID);
        const uniquePartyIDs = new Set(partyIDs);
    
        // If the size of the set is equal to the length of the array, all IDs are unique
        return uniquePartyIDs.size === partyArray.length;
    }
    
}