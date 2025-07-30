import { generatePositionName, generatePositionsToVote, generatePostulations } from './positionOptions.js';
import readline from 'readline';
import { faker } from '@faker-js/faker';
import fs from 'fs';

// Crear una interfaz para leer desde la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para hacer preguntas y obtener respuestas
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}


function generateParties(N = 15) // Número de partidos a generar)
{
    let parties = [];

    for (let i = 0; i < N; i++) {
        let party = {
            partyID: faker.string.uuid(),
            partyName: `Partido ${faker.person.lastName()} ${faker.word.noun()}`
        };
        parties.push(party);
    }
    fs.writeFileSync('../generated_data/parties.json', JSON.stringify(parties, null, 2));
    console.log('Partidos generados y guardados en parties.json');
    return (parties);
}

function generatePositions(N = 15)
{
    let positions = [];

    for (let i = 0; i < N; i++) {
        let position = {
            positionID: faker.string.uuid(),
            positionName: generatePositionName(),
            vacancies: faker.number.int({min:1, max:4}),

        };
        positions.push(position);
    }
    fs.writeFileSync('../generated_data/positions.json', JSON.stringify(positions, null, 2));
    console.log('Posiciones generadas y guardadas en positions.json');
    return (positions);
}

function generateCandidates(positions, parties, N = 15)
{
    let candidates = [];

    for (let i = 0; i < N; i++) {
        let candidate = {
            candidateID: faker.string.uuid(),
            candidateFirstName: faker.person.firstName(),
            candidateSecondName: faker.person.middleName(),
            candidateFirstLastName: faker.person.lastName(),
            candidateSecondLastName: faker.person.lastName(),
            postulations: generatePostulations(positions, parties),
        };
        candidates.push(candidate);
    }
    fs.writeFileSync('../generated_data/candidates.json', JSON.stringify(candidates, null, 2));
    console.log('Candidatos generados y guardados en candidates.json');
    return candidates;
}

function generateElectors(positions, N = 15)
{
    let electors = [];

    for (let i = 0; i < N; i++) {
        let elector = {
            electorID: faker.string.uuid(),
            multiplier: faker.number.int({ min: 1, max: 3 }),
            electorFirstName: faker.person.firstName(),
            electorSecondName: faker.person.middleName(),
            electorFirstLastName: faker.person.lastName(),
            electorSecondLastName: faker.person.lastName(),
            positionsToVote: generatePositionsToVote(positions),
        };
        electors.push(elector);
    }
    fs.writeFileSync('../generated_data/electors.json', JSON.stringify(electors, null, 2));
    console.log('Electores generados y guardados en electors.json');
    return electors;
}

function setElectionConfig(parties, positions, candidates, electors, minimum_approvals){
    const electionConfig = {
        parties,
        positions,
        candidates,
        electors,
        minimum_approvals,
        liveResults: true,
        startVotingDate: "2025-11-15T00:00:00Z",
        endVotingDate:"2025-11-25T00:00:00Z"
    }
    fs.writeFileSync('../generated_data/electionConfig.json', JSON.stringify(electionConfig, null, 2));
    console.log('Configuración de la elección guardada en electionConfig.json');
    return;
}

async function simulateData() {
    const qParties = Number(await askQuestion("Por favor, ingresa la cantidad de partidos: "));
    const qPositions = Number(await askQuestion("Por favor, ingresa la cantidad de posiciones: "));
    const qCandidates = Number(await askQuestion("Por favor, ingresa la cantidad de candidatos: "));
    const qElectors = Number(await askQuestion("Por favor, ingresa la cantidad de electores: "));
    const qApprovals = Number(await askQuestion("Por favor, ingresa la cantidad minima de aprobaciones: "));
    rl.close();
    setElectionConfig(qParties, qPositions, qCandidates, qElectors, qApprovals);
    const parties = generateParties(qParties);
    const positions = generatePositions(qPositions);
    const candidates = generateCandidates(positions, parties, qCandidates);
    const electors = generateElectors(positions, qElectors);
    console.log(generateVotes(electors, candidates));

}

function generateVotes(electors, candidates) {
  let votes = [];

  for (let i = 0; i < electors.length; i++) {
    for (let j = 0; j < electors[i].positionsToVote.length; j++) {
      // 20% de probabilidad de no votar
      if (Math.random() < 0.2) {
        continue; // saltar esta votación
      }
      const positionID = electors[i].positionsToVote[j];

      const possibleOptions = candidates.filter(candidate =>
        candidate.postulations.some(
          postulation => postulation.positionID === positionID
        )
      );

      if (possibleOptions.length === 0) {
        // No hay candidatos para esta posición, saltar
        continue;
      }

      const candidate = possibleOptions[faker.number.int({ min: 0, max: possibleOptions.length - 1 })];

      const shuffledPostulations = faker.helpers.shuffle(candidate.postulations);
      const postulation = shuffledPostulations.find(
        postulation => postulation.positionID === positionID
      );

      if (!postulation) {
        // Por si acaso no se encuentra postulación coincidente, saltar
        continue;
      }

      let vote = {
        postulationID: postulation.postulationID,
        electorID: electors[i].electorID,
        candidateID: candidate.candidateID,
      };

      votes.push(vote);
    }
  }

  fs.writeFileSync('../generated_data/votes.json', JSON.stringify(votes, null, 2));
  console.log('Votos generados y guardados en votes.json');
  const uniqueCandidateIDs = new Set(votes.map(vote => vote.electorID));
  return uniqueCandidateIDs.size;

}

simulateData();

