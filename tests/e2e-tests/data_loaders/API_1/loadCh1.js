import { postElectionConfig } from './loadElectionConfig.js';
import { postPartiesInBatches } from './loadParties.js';
import { postPositions } from './loadPositions.js';
import { postCandidatesInBatches } from './loadCandidates.js';
import { postElectorsInBatches } from './loadElectors.js';

// load election
await postElectionConfig();
// load parties
await postPartiesInBatches();
// load positions
await postPositions();
// load candidates
await postCandidatesInBatches();
// load electors
await postElectorsInBatches();