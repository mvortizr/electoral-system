/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { DummyContract } from './contracts/DummyContract';
import { ExplorerContract } from './contracts/ExplorerContract';
import { VoteRegistryContract } from './contracts/VoteRegistry';


export const contracts: any[] = [
    DummyContract,
    VoteRegistryContract,
    ExplorerContract
];
