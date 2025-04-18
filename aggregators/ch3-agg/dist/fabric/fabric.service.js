"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabricService = void 0;
const common_1 = require("@nestjs/common");
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const grpc = require("@grpc/grpc-js");
const fs_1 = require("fs");
const path = require("path");
const util_1 = require("util");
const crypto = require("crypto");
let FabricService = class FabricService {
    constructor() {
        this.gateway = null;
        this.client = null;
        this.mspID = process.env.MSP_ID;
        this.keyDirectory = process.env.KEY_DIRECTORY;
        this.certDirectory = process.env.CERT_DIRECTORY;
        this.peerTlsCert = process.env.PEER_TLS_CERT;
        this.peerEndpoint = process.env.PEER_ENDPOINT;
        this.peerHostAlias = process.env.PEER_HOST_ALIAS;
        this.utf8Decoder = new util_1.TextDecoder();
        this.channelName = process.env.CHANNEL_NAME;
    }
    async onModuleInit() {
        await this.connect();
    }
    async onModuleDestroy() {
        await this.disconnect();
    }
    async displayInputParameters() {
        console.log(`mspID:             ${this.mspID}`);
        console.log(`keyDirectory:  ${this.keyDirectory}`);
        console.log(`certDirectory: ${this.certDirectory}`);
        console.log(`tlsCert:       ${this.peerTlsCert}`);
        console.log(`peerEndpoint:      ${this.peerEndpoint}`);
        console.log(`peerHostAlias:     ${this.peerHostAlias}`);
    }
    async connect() {
        this.displayInputParameters();
        const identity = await this.newIdentity();
        const signer = await this.newSigner();
        const client = await this.newGrpcConnection();
        this.client = client;
        this.gateway = await (0, fabric_gateway_1.connect)({
            client,
            identity,
            signer,
            evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
            endorseOptions: () => ({ deadline: Date.now() + 15000 }),
            submitOptions: () => ({ deadline: Date.now() + 5000 }),
            commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
        });
    }
    async disconnect() {
        this.gateway.close();
        if (this.client !== null) {
            this.client.close();
        }
    }
    async newGrpcConnection() {
        const pemBuffer = Buffer.from(this.peerTlsCert);
        const tlsCredentials = grpc.credentials.createSsl(pemBuffer);
        return new grpc.Client(this.peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': this.peerHostAlias,
        });
    }
    async newIdentity() {
        const credentials = new TextEncoder().encode(this.certDirectory);
        return { mspId: this.mspID, credentials };
    }
    async submitTransaction(chaincodeName, functionName, ...args) {
        const network = await this.gateway.getNetwork(this.channelName);
        const contract = network.getContract(chaincodeName);
        const result = await contract.submitTransaction(functionName, ...args);
        console.log(`Transaction has been submitted, result is: ${result.toString()}`);
        return result;
    }
    async evaluateTransaction(chaincodeName, functionName, params) {
        const network = await this.gateway.getNetwork(this.channelName);
        const contract = network.getContract(chaincodeName);
        if (!params) {
            const resultBytes = await contract.evaluateTransaction(functionName);
            const resultJson = this.utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            return result;
        }
        else {
            const resultBytes = await contract.evaluateTransaction(functionName, params);
            const resultJson = this.utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            return result;
        }
    }
    async getFirstDirFileName(dirPath) {
        const files = await fs_1.promises.readdir(dirPath);
        const file = files[0];
        if (!file) {
            throw new Error(`No files in directory: ${dirPath}`);
        }
        return path.join(dirPath, file);
    }
    async newSigner() {
        const privateKey = crypto.createPrivateKey(this.keyDirectory);
        return fabric_gateway_1.signers.newPrivateKeySigner(privateKey);
    }
};
exports.FabricService = FabricService;
exports.FabricService = FabricService = __decorate([
    (0, common_1.Injectable)()
], FabricService);
//# sourceMappingURL=fabric.service.js.map