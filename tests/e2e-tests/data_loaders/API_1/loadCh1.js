import postElectionConfig from './loadElectionConfig.js';
import postPartiesInBatches from './loadParties.js';
import postPositions from './loadPositions.js';
import postCandidatesInBatches from './loadCandidates.js';
import postElectorsInBatches from './loadElectors.js';

// load election
postElectionConfig();
// load parties
postPartiesInBatches();
// load positions
postPositions();
// load candidates
postCandidatesInBatches();
// load electors
postElectorsInBatches();