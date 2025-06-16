import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { closedLifecycleKey, openedLifecycleKey, electionStatus, lifecycleTypes} from '../models/lifecycle_types';


@Info({title: 'Lifecycle contract', description: 'Smart contract to handle opening and closure of the election'})
export class LifecycleContract extends Contract {

    //Adds voter registry
    @Transaction()
    @Returns('string')
    public async requestOpening(ctx: Context, 
        minimalApprovalStr: string
    ): Promise<String> {

        // Make definitions
        const minimalApproval = parseInt(minimalApprovalStr);
        if (isNaN(minimalApproval)) {
            return JSON.stringify({ success: false, error: 'Invalid minimalApproval parameter' });
        }

        const role = ctx.clientIdentity.getAttributeValue('role');
        const userID = ctx.clientIdentity.getID(); 

        //check #0: If election is closed, return
        const closedBlockBytes = await ctx.stub.getState(closedLifecycleKey);
        if (closedBlockBytes && closedBlockBytes.length > 0) {
            const closedBlock = JSON.parse(closedBlockBytes.toString());
            if (closedBlock.election_status === electionStatus.CLOSED) {
                return JSON.stringify({ success: false, error: 'Election is already closed' });
            }
        }
        
        //check #1: User has to be a superadmin
        if (role !== 'superadmin') {
            return JSON.stringify({success: false, error:`User is not superadmin`});
        }

        //check #2: Same superadmin hasn't requested previously
        const requestKey = `requestOpening:${userID}`;
        const existingRequest = await ctx.stub.getState(requestKey);
        if (existingRequest && existingRequest.length > 0) {
            return JSON.stringify({ success: false, error: 'This superadmin already requested opening' });
        }

        // store request
        const timestamp = new Date().toISOString();
        await ctx.stub.putState(requestKey, Buffer.from(JSON.stringify({
            userID,
            timestamp,
        })));

        // count all the approval requests
        const iterator = await ctx.stub.getStateByRange('requestOpening:', 'requestOpening;'); 
        let approvalCount = 1; 
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.key.startsWith('requestOpening:')) {
                approvalCount++;
            }
            if (res.done) break;
            
        }
        await iterator.close();
    

        let status = electionStatus.WAITING;
        const missingSigns = Math.max(0, minimalApproval - approvalCount);

        // Check if it's already opened
        const openedBlockBytes = await ctx.stub.getState(openedLifecycleKey);
        if (openedBlockBytes && openedBlockBytes.length > 0) {
            const openedBlock = JSON.parse(openedBlockBytes.toString());
            if (openedBlock.election_status === electionStatus.OPEN) {
                status = electionStatus.OPEN;
            }
        } else if (approvalCount >= minimalApproval) {
            // Finalize opening if it just passed the threshold
            const openedBlock = {
                election_status: electionStatus.OPEN,
                opened_at: new Date().toISOString(),
                type: lifecycleTypes.CONTROL_BLOCK
            };
            await ctx.stub.putState(openedLifecycleKey, Buffer.from(JSON.stringify(openedBlock)));
            status = electionStatus.OPEN;
        }

   
        return JSON.stringify({
            success: true,
            status: status,
            open_approval_count: approvalCount,
            missing_signs: missingSigns
        });
    }


    @Transaction()
    @Returns('string')
    public async requestClosing(ctx: Context, 
        minimalApprovalStr: string
    ): Promise<String> {

        // Make definitions
        const minimalApproval = parseInt(minimalApprovalStr);
        if (isNaN(minimalApproval)) {
            return JSON.stringify({ success: false, error: 'Invalid minimalApproval parameter' });
        }

        const role = ctx.clientIdentity.getAttributeValue('role');
        const userID = ctx.clientIdentity.getID(); 

        //check #0: If election is not opened, return
        const openedBlockBytes = await ctx.stub.getState(openedLifecycleKey);
        if (!openedBlockBytes || openedBlockBytes.length === 0) {
            return JSON.stringify({ success: false, error: 'Election has not been opened' });
        }
        
        //check #1: User has to be a superadmin
        if (role !== 'superadmin') {
            return JSON.stringify({success: false, error:`User is not superadmin`});
        }

        //check #2: Same superadmin hasn't requested previously
        const requestKey = `requestClosing:${userID}`;
        const existingRequest = await ctx.stub.getState(requestKey);
        if (existingRequest && existingRequest.length > 0) {
            return JSON.stringify({ success: false, error: 'This superadmin already requested closing' });
        }

        // store request
        const timestamp = new Date().toISOString();
        await ctx.stub.putState(requestKey, Buffer.from(JSON.stringify({
            userID,
            timestamp,
        })));

        // count all the approval requests
        const iterator = await ctx.stub.getStateByRange('requestClosing:', 'requestClosing;'); 
        let approvalCount = 1; 
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.key.startsWith('requestClosing:')) {
                approvalCount++;
            }
            if (res.done) break;
            
        }
        await iterator.close();
    

        let status = electionStatus.OPEN;
        const missingSigns = Math.max(0, minimalApproval - approvalCount);

        // Check if already finalized
        const closedBlockBytes = await ctx.stub.getState(closedLifecycleKey);
        if (closedBlockBytes && closedBlockBytes.length > 0) {
            const closedBlock = JSON.parse(closedBlockBytes.toString());
            if (closedBlock.election_status === electionStatus.CLOSED) {
                status = electionStatus.CLOSED
            }
        }else if (approvalCount >= minimalApproval) {
            // Finalize closing if it just passed the threshold
            const closedBlock = {
                election_status: electionStatus.CLOSED,
                closed_at: new Date().toISOString(),
                type: lifecycleTypes.CONTROL_BLOCK
            };
            await ctx.stub.putState(closedLifecycleKey, Buffer.from(JSON.stringify(closedBlock)));
            status = electionStatus.CLOSED;
        }

    
        return JSON.stringify({
            success: true,
            status: status,
            close_approval_count: approvalCount,
            missing_signs: missingSigns
        });
    }

    // TODO: check election status (for api2)
    

}