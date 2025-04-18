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
exports.ResultController = void 0;
const common_1 = require("@nestjs/common");
const result_service_1 = require("./result.service");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const fabric_service_1 = require("../../fabric/fabric.service");
const swagger_1 = require("@nestjs/swagger");
let ResultController = class ResultController {
    constructor(resultService, fabricService) {
        this.resultService = resultService;
        this.fabricService = fabricService;
        this.fabricService.connect();
    }
};
exports.ResultController = ResultController;
exports.ResultController = ResultController = __decorate([
    (0, swagger_1.ApiHeader)({
        name: 'auth',
        description: 'Api key token',
        required: true,
    }),
    (0, common_1.Controller)('result'),
    (0, common_1.UseGuards)(auth_middleware_1.ApiKeyGuard),
    __metadata("design:paramtypes", [result_service_1.ResultService,
        fabric_service_1.FabricService])
], ResultController);
//# sourceMappingURL=result.controller.js.map