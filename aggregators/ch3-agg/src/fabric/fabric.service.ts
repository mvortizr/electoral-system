import { Injectable } from '@nestjs/common';
import { Gateway, Identity, Signer, connect, signers, ChaincodeEvent, CloseableAsyncIterable, GatewayError} from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import * as crypto from 'crypto';



@Injectable()
export class FabricService {

    gateway: Gateway | null = null;
    client: grpc.Client | null = null;
    mspID: string = process.env.MSP_ID!
    keyDirectory: string = process.env.KEY_DIRECTORY!
    certDirectory: string= process.env.CERT_DIRECTORY!
    peerTlsCert: string = process.env.PEER_TLS_CERT!
    peerEndpoint: string = process.env.PEER_ENDPOINT!
    peerHostAlias: string = process.env.PEER_HOST_ALIAS!
    utf8Decoder = new TextDecoder();
    channelName: string = process.env.CHANNEL_NAME!
    events: CloseableAsyncIterable<ChaincodeEvent> | undefined;

    async onModuleInit(): Promise<void> {
        await this.connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.disconnect();
    }

    async displayInputParameters(): Promise<void> { //DEBUG ONLY
        console.log(`mspID:             ${this.mspID}`);
        console.log(`keyDirectory:  ${this.keyDirectory}`);
        console.log(`certDirectory: ${this.certDirectory}`);
        console.log(`tlsCert:       ${this.peerTlsCert}`);
        console.log(`peerEndpoint:      ${this.peerEndpoint}`);
        console.log(`peerHostAlias:     ${this.peerHostAlias}`);
    }

    async connect(): Promise<void> {
        this.displayInputParameters();
        
        const identity = await this.newIdentity();
        const signer = await this.newSigner();
        const client = await this.newGrpcConnection();
        this.client = client

        
        this.gateway = await connect({
            client,
            identity,
            signer,
            evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
            endorseOptions: () => ({ deadline: Date.now() + 15000 }),
            submitOptions: () => ({ deadline: Date.now() + 5000 }),
            commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
          });
        
    }

    async disconnect(): Promise<void> {
        this.gateway!.close();
        if (this.client !== null) {
            this.client.close();
        }

        if(this.events != undefined) {
            this.events?.close()
        }
        
    }

    async  newGrpcConnection(): Promise<grpc.Client> {
        const pemBuffer = Buffer.from(this.peerTlsCert)
        const tlsCredentials = grpc.credentials.createSsl(pemBuffer);
        return new grpc.Client(this.peerEndpoint, tlsCredentials, { 
            'grpc.ssl_target_name_override': this.peerHostAlias,
        });
    }

    private async newIdentity(): Promise<Identity> {
        const credentials = new TextEncoder().encode(this.certDirectory);
        return { mspId: this.mspID, credentials };
    }

    // async submitTransaction(chaincodeName: string, functionName: string, ...args: any[]): Promise<any> {
    //     // Get the network (channel) our contract is deployed to.
    //     const network = await this.gateway!.getNetwork(this.channelName); 

    //     // Get the contract from the network.
    //     const contract = network.getContract(chaincodeName);

    //     // Submit the specified transaction.
    //     const result = await contract.submitTransaction(functionName, ...args);
    //     console.log(`Transaction has been submitted, result is: ${result.toString()}`);

    //     return result;
    // }

    // async evaluateTransaction(chaincodeName: string, functionName: string, params?: any): Promise<any> {
    //     // Get the network (channel) our contract is deployed to.
    //     const network = await this.gateway!.getNetwork(this.channelName); 
    //     // Get the contract from the network.
    //     const contract = network.getContract(chaincodeName);

    //     // Submit the specified transaction.
    //     if (!params) {
    //         const resultBytes = await contract.evaluateTransaction(functionName);
    //         const resultJson = this.utf8Decoder.decode(resultBytes);
    //         const result = JSON.parse(resultJson);

    //         return result;
    //     } else {
    //         const resultBytes = await contract.evaluateTransaction(functionName, params);
    //         const resultJson = this.utf8Decoder.decode(resultBytes);
    //         const result = JSON.parse(resultJson);

    //         return result;
    //     }
        
        
    // }


    async readEvents(events: CloseableAsyncIterable<ChaincodeEvent>): Promise<void> {
        try {
            for await (const event of events) {
                const payloadJSON = this.utf8Decoder.decode(event.payload);
                const payload = JSON.parse(payloadJSON);
                console.log(`\n<-- Chaincode event received: ${event.eventName} -`, payload);
            }
        } catch (error: unknown) {
            // Ignore the read error when events.close() is called explicitly
            if (!(error instanceof GatewayError) || error.code !== grpc.status.CANCELLED.valueOf()) {
                throw error;
            }
        }
    }

    

    async listenToEvents(chaincodeName: string) {
          // Get the network (channel) our contract is deployed to.
          const network = await this.gateway!.getNetwork(this.channelName); 

          const events = await network.getChaincodeEvents(chaincodeName);

          void this.readEvents(events); 
        
        
        
          //   const listener = async (event) => {
        //     const eventName = event.eventName;
        //     const payload = event.payload.toString();
      
        //     console.log(`📢 Chaincode Event Received: ${eventName}`);
        //     console.log(`🧾 Payload: ${payload}`);
      
        //     // You can emit it through a NestJS EventEmitter here
        //   };


      
          //await contract.addContractListener(listener);
          //console.log('🚀 Listening to chaincode events...');

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
        const privateKey = crypto.createPrivateKey(this.keyDirectory);
        return signers.newPrivateKeySigner(privateKey);
    }


}
