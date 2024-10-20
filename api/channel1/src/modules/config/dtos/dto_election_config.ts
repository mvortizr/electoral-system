import { IsNotEmpty, IsInt, IsPositive, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DTOElectionConfig {
   
    @ApiProperty({ description: 'number of parties to register' })
    @IsInt()
    @Min(0)
    @Max(999)
    @IsNotEmpty()
    parties!: number;

    @ApiProperty({ description: 'number of positions to register' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    positions!:number;

    @ApiProperty({ description: 'number of candidates to register' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    candidates!: number;

    @ApiProperty({ description: 'number of electors to register' })
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