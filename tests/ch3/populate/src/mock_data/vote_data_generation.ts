import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

function generateVotePayload(multiplier = 1) {
  return {
    positionID: uuidv4(),
    positionExtID: uuidv4(),
    postulationID: uuidv4(),
    candidateID: uuidv4(),
    partyID: uuidv4(),
    postulationExtID: uuidv4(),
    candidateExtID: uuidv4(),
    partyExtID: uuidv4(),
    multiplier,
  };
}

function generateVotePayloads(count: number) {
  const votePayloads = [];

  for (let i = 0; i < count; i++) {
    const multiplier = Math.floor(Math.random() * 5) + 1; // random multiplier from 1 to 5
    votePayloads.push(generateVotePayload(multiplier));
  }

  return votePayloads;
}

// Change this number to generate more/less
const numberOfPayloads = 20;
const votePayloads = generateVotePayloads(numberOfPayloads);

const outputPath = path.join(__dirname, 'vote_data.json');
fs.writeFileSync(outputPath, JSON.stringify(votePayloads, null, 2));

console.log(`✅ votePayloads.json written to ${outputPath}`);
