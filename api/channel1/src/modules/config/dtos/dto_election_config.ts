import { IsNotEmpty, IsInt, IsPositive, Min, Max, IsDateString, IsBoolean } from 'class-validator';
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
    positions!: number;

    @ApiProperty({ description: 'number of candidates to register' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    candidates!: number;

    @ApiProperty({ description: 'number of electors to register' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    electors!: number;

    @ApiProperty({ description: 'start date of voting in yyyy-mm-dd format' })
    @IsDateString({ strict: true }, { message: 'startVotingDate must be a valid date in yyyy-mm-dd format' })
    startVotingDate!: string;

    @ApiProperty({ description: 'closing date of voting in yyyy-mm-dd format' })
    @IsDateString({ strict: true }, { message: 'closeVotingDate must be a valid date in yyyy-mm-dd format' })
    endVotingDate!: string;

    @ApiProperty({ description: 'enable live results display', type: Boolean })
    @IsBoolean()
    liveResults!: boolean;

    @ApiProperty({ description: 'enable live voting turnout display', type: Boolean })
    @IsBoolean()
    liveVotingTurnout!: boolean;

    constructor(
        parties: number,
        positions: number,
        candidates: number,
        electors: number,
        startVotingDate: string,
        endVotingDate: string,
        liveResults: boolean,
        liveVotingTurnout: boolean
    ) {
        this.parties = parties;
        this.positions = positions;
        this.candidates = candidates;
        this.electors = electors;
        this.startVotingDate = startVotingDate;
        this.endVotingDate = endVotingDate;
        this.liveResults = liveResults;
        this.liveVotingTurnout = liveVotingTurnout;
    }
}
