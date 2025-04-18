export declare class storeVoteDTO {
    positionID: string;
    positionExtID: string;
    postulationID: string;
    candidateID: string;
    partyID: string;
    postulationExtID: string;
    candidateExtID: string;
    partyExtID: string;
    multiplier?: number;
    constructor(postulationID: string, candidateID: string, partyID: string, postulationExtID: string, candidateExtID: string, partyExtID: string, multiplier?: number);
}
