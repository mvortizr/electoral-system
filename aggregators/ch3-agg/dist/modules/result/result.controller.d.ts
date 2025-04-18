import { ResultService } from './result.service';
import { FabricService } from '../../fabric/fabric.service';
export declare class ResultController {
    private readonly resultService;
    private readonly fabricService;
    constructor(resultService: ResultService, fabricService: FabricService);
}
