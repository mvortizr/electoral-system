// Run with node sendStructuredFakeVotes.js

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

const API_3_ENDPOINT = "http://channel3-api.localho.st/vote/save"

// --- Registry setup
const positions = Array.from({ length: 10 }).map(() => ({
  id: uuidv4(),
  extID: uuidv4(),
  name: faker.person.jobTitle(),
}));

const parties = Array.from({ length: 5 }).map(() => ({
  id: uuidv4(),
  extID: uuidv4(),
  name: faker.company.name() + ' Party',
}));

const candidates = Array.from({ length: 20 }).map(() => ({
  id: uuidv4(),
  extID: uuidv4(),
  fullName: faker.person.fullName(),
}));

const postulations = [];
const postulationTracker = new Map();

positions.forEach((position) => {
  const numCandidates = faker.number.int({ min: 2, max: 5 });
  const shuffledCandidates = faker.helpers.shuffle(candidates);

  for (let i = 0; i < numCandidates; i++) {
    const candidate = shuffledCandidates[i];
    const withParty = Math.random() < 0.7;
    let party = null;

    if (withParty) {
      const availableParties = faker.helpers.shuffle(parties).filter((p) => {
        return !postulationTracker.has(`${candidate.id}_${position.id}_${p.id}`);
      });

      if (availableParties.length === 0) continue;

      party = availableParties[0];
    }

    const key = `${candidate.id}_${position.id}_${party ? party.id : 'none'}`;
    if (postulationTracker.has(key)) continue;

    const postulation = {
      id: uuidv4(),
      extID: uuidv4(),
      candidate,
      position,
      party,
    };

    postulations.push(postulation);
    postulationTracker.set(key, true);
  }
});

// --- Voting results tracker
const voteResults = new Map(); // key: positionID → { party, candidate } → totalVotes

function generateVoteFromPostulation(postulation) {
  const { candidate, position, party } = postulation;

  return {
    multiplier: Math.floor(Math.random() * 5) + 1,
    positionID: position.id,
    positionExtID: position.extID,
    positionName: position.name,
    postulationID: postulation.id,
    postulationExtID: postulation.extID,
    candidateID: candidate.id,
    candidateExtID: candidate.extID,
    candidateFullName: candidate.fullName,
    ...(party && {
      partyID: party.id,
      partyExtID: party.extID,
      partyName: party.name,
    }),
  };
}

async function sendVote() {
  const postulation = faker.helpers.arrayElement(postulations);
  const payload = generateVoteFromPostulation(postulation);
  const { positionID, candidateFullName, partyName = null , multiplier } = payload;

  try {
    await axios.post(API_3_ENDPOINT, payload);
    console.log(`✅ Sent vote for ${payload.positionName} → ${candidateFullName}`);

    // Update results tracking
    if (!voteResults.has(positionID)) voteResults.set(positionID, new Map());

    const positionMap = voteResults.get(positionID);
    const key = `${candidateFullName}_${partyName}`;
    if (!positionMap.has(key)) {
      positionMap.set(key, { candidate: candidateFullName, party: partyName, totalVotes: 0 });
    }

    const result = positionMap.get(key);
    result.totalVotes += payload.multiplier;

  } catch (err) {
    console.error('❌ Vote failed:', err.response?.data || err.message);
  }
}

async function sendManyVotes(count = 10) {
  for (let i = 0; i < count; i++) {
    await sendVote();
  }

  // Generate result summary after voting
  const resultsOutput = [];
  for (const [positionID, votesMap] of voteResults.entries()) {
    const resultGroup = Array.from(votesMap.values());
    resultsOutput.push({ positionID, results: resultGroup });
  }

  console.log('\n📊 Final Vote Results:');
  console.dir(resultsOutput, { depth: null });
}

sendManyVotes(20); // Change count as needed
