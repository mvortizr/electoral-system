import { Injectable } from '@nestjs/common';
import { Gateway, Identity, Signer, connect, signers } from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import * as crypto from 'crypto';


@Injectable()
export class FabricService {

    gateway: Gateway;
    client!: grpc.Client | null;
    channelName: string = process.env.CHANNEL_NAME!
    chaincodeName: string = process.env.CHAINCODE_NAME!
    mspID: string = process.env.MSP_ID!
    cryptoPath: string = process.env.CRYPTO_PATH!
    keyDirectoryPath: string =  path.resolve(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore')
    tlsCertPath:string = path.resolve(this.cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt')
    peerEndpoint: string = process.env.PEER_ENDPOINT!
    peerHostAlias: string = process.env.PEER_HOST_ALIAS!

    async onModuleInit(): Promise<void> {
        await this.connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.disconnect();
    }

    async connect(): Promise<void> {
        this.client = await this.newGrpcConnection()
        const identity = await this.newIdentity();
        const signer = await this.newSigner();
        let c = this.client

        
        this.gateway = await connect({
            c,
            identity,
            signer,
            evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
            endorseOptions: () => ({ deadline: Date.now() + 15000 }),
            submitOptions: () => ({ deadline: Date.now() + 5000 }),
            commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
          });
        
    }

    async disconnect(): Promise<void> {
        this.gateway.close();
        if (this.client !== null) {
            this.client.close();
        }
        
    }

    async  newGrpcConnection(): Promise<grpc.Client> {
        const tlsRootCert = await fs.readFile(this.tlsCertPath);
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        return new grpc.Client(this.peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': this.peerHostAlias,
        });
    }

    private async newIdentity(): Promise<Identity> {
        const certDirectoryPath = path.join(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts');
        const certPath = await this.getFirstDirFileName(certDirectoryPath);
        const credentials = await fs.readFile(certPath);
        return { mspId: this.mspID, credentials };
    }

    async getFirstDirFileName(dirPath: string): Promise<string> {
        const files = await fs.readdir(dirPath);
        const file = files[0];
        if (!file) {
            throw new Error(`No files in directory: ${dirPath}`);
        }
        return path.join(dirPath, file);
    }

    async newSigner(): Promise<Signer> {
        const keyPath = await this.getFirstDirFileName(this.keyDirectoryPath);
        const privateKeyPem = await fs.readFile(keyPath);
        const privateKey = crypto.createPrivateKey(privateKeyPem);
        return signers.newPrivateKeySigner(privateKey);
    }


}
