import { Gateway, Signer } from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';
import { TextDecoder } from 'util';
export declare class FabricService {
    gateway: Gateway | null;
    client: grpc.Client | null;
    mspID: string;
    keyDirectory: string;
    certDirectory: string;
    peerTlsCert: string;
    peerEndpoint: string;
    peerHostAlias: string;
    utf8Decoder: TextDecoder;
    channelName: string;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    displayInputParameters(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    newGrpcConnection(): Promise<grpc.Client>;
    private newIdentity;
    submitTransaction(chaincodeName: string, functionName: string, ...args: any[]): Promise<any>;
    evaluateTransaction(chaincodeName: string, functionName: string, params?: any): Promise<any>;
    getFirstDirFileName(dirPath: string): Promise<string>;
    newSigner(): Promise<Signer>;
}
