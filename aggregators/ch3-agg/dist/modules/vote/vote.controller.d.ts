import { Response } from 'express';
import { VoteService } from './vote.service';
import { FabricService } from '../../fabric/fabric.service';
import { storeVoteDTO } from './dtos/storeVoteDTO';
export declare class VoteController {
    private readonly voteService;
    private readonly fabricService;
    constructor(voteService: VoteService, fabricService: FabricService);
    setVote(vote: storeVoteDTO, res: Response): Promise<object>;
}
