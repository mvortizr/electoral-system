/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {DummyContract} from './contracts/DummyContract';
import {ElectionConfigContract} from './contracts/ElectionConfigContract';
import { PositionContract } from './contracts/PositionsContract';
import { ElectorsContract } from './contracts/ElectorsContract';
import { PartiesContract } from './contracts/PartiesContract';
import { CandidatesContract } from './contracts/CandidatesContract';


export const contracts: any[] = [
    DummyContract, 
    ElectionConfigContract, 
    PositionContract,
    ElectorsContract,
    PartiesContract,
    CandidatesContract
];
