export enum lifecycleTypes {
    CONTROL_BLOCK =  'lifecycle_control_block'
}

export const closedLifecycleKey = 'lifecycle_closed_block';

export const openedLifecycleKey = 'lifecycle_opened_block';

export enum electionStatus {
    OPEN = 'opened',
    CLOSED = 'closed',
    WAITING = 'waiting for opening'
}