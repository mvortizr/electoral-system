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
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeVoteDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class storeVoteDTO {
    constructor(postulationID, candidateID, partyID, postulationExtID, candidateExtID, partyExtID, multiplier) {
        this.postulationID = postulationID;
        this.candidateID = candidateID;
        this.partyID = partyID;
        this.postulationExtID = postulationExtID;
        this.candidateExtID = candidateExtID;
        this.partyExtID = partyExtID;
        this.multiplier = multiplier;
    }
}
exports.storeVoteDTO = storeVoteDTO;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], storeVoteDTO.prototype, "positionID", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], storeVoteDTO.prototype, "positionExtID", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], storeVoteDTO.prototype, "postulationID", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], storeVoteDTO.prototype, "candidateID", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], storeVoteDTO.prototype, "partyID", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], storeVoteDTO.prototype, "postulationExtID", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], storeVoteDTO.prototype, "candidateExtID", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], storeVoteDTO.prototype, "partyExtID", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Transform)(({ value }) => (value !== undefined ? parseInt(value, 10) : 1)),
    __metadata("design:type", Number)
], storeVoteDTO.prototype, "multiplier", void 0);
//# sourceMappingURL=storeVoteDTO.js.map