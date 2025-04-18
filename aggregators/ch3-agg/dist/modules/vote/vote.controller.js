"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteController = void 0;
const common_1 = require("@nestjs/common");
const vote_service_1 = require("./vote.service");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const fabric_service_1 = require("../../fabric/fabric.service");
const swagger_1 = require("@nestjs/swagger");
const uuid_1 = require("uuid");
const storeVoteDTO_1 = require("./dtos/storeVoteDTO");
let VoteController = class VoteController {
    constructor(voteService, fabricService) {
        this.voteService = voteService;
        this.fabricService = fabricService;
        this.fabricService.connect();
    }
    async setVote(vote, res) {
        const chaincode = process.env.CHAINCODE_NAME.toString();
        const functionName = "VoteContract:createVote";
        const internalRegistryUID = (0, uuid_1.v4)();
        const result = await this.fabricService.submitTransaction(chaincode, functionName, internalRegistryUID, JSON.stringify({ ...vote }));
        let parsedResults = new TextDecoder().decode(result);
        let finalResult = JSON.parse(parsedResults);
        if (!(finalResult.success)) {
            return res.status(400).json({ statusCode: 400, ...finalResult });
        }
        return res.status(201).json({ statusCode: 201, message: 'vote salved correctly', success: true });
    }
};
exports.VoteController = VoteController;
__decorate([
    (0, common_1.Post)('/register'),
    (0, swagger_1.ApiOperation)({ summary: "Lets user vote for a candidate" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [storeVoteDTO_1.storeVoteDTO, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "setVote", null);
exports.VoteController = VoteController = __decorate([
    (0, swagger_1.ApiHeader)({
        name: 'auth',
        description: 'Api key token',
        required: true,
    }),
    (0, common_1.Controller)('vote'),
    (0, common_1.UseGuards)(auth_middleware_1.ApiKeyGuard),
    __metadata("design:paramtypes", [vote_service_1.VoteService,
        fabric_service_1.FabricService])
], VoteController);
//# sourceMappingURL=vote.controller.js.map