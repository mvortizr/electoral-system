import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
//import { electoralRollType } from '../models/electoralRollType';
//import { voteRegistryType } from '../models/voteRegistryType';

@Info({title: 'Lifecycle contract', description: 'Smart contract to handle opening and closure of the election'})
export class LifecycleContract extends Contract {

    //Adds voter registry
    @Transaction()
    @Returns('string')
    public async requestOpening(ctx: Context, 
        minimalApprovalStr: string
    ): Promise<String> {

        //check #0: If election is opened, return 
        
        //check #1: User has to be a superadmin
        const role = ctx.clientIdentity.getAttributeValue('role');
        const userID = ctx.clientIdentity.getID(); 

        if (role !== 'superadmin') {
            return JSON.stringify({success: false, error:`User is not superadmin`});
        }

        //check #2: Same superadmin hasn't requested previously
        const requestKey = `requestOpening:${userID}`;
        const existingRequest = await ctx.stub.getState(requestKey);
        if (existingRequest && existingRequest.length > 0) {
            return JSON.stringify({ success: false, error: 'This superadmin already requested opening' });
        }

        // record requestOpening
        const timestamp = new Date().toISOString();
        await ctx.stub.putState(requestKey, Buffer.from(JSON.stringify({
            userID,
            timestamp,
        })));

        // get all requestOpenings in channel 3
    

        // if requestOpenings > minimal_approval -> log election_status: open , check if its open

   
        return JSON.stringify({success: true});
    }


    // TODO: transaction close

    // TODO: check election status (for api2)
    

}