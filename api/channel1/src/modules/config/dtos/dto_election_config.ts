import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class DTOElectionConfig {
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    parties!: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    positions!:number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    candidates!: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    electors!:number;

    constructor(parties: number, positions: number, candidates: number, electors: number) {
        this.parties = parties;
        this.positions = positions;
        this.candidates = candidates;
        this.electors = electors;
    }
}