import { faker } from '@faker-js/faker';

const position =
["Presidente",
  "Vicepresidente",
  "Senador",
  "Diputado",
  "Gobernador",
  "Alcalde",
  "Concejal",
  "Consejero Legislativo Regional",
  "Regidor",
  "Representante ante Organismos Internacionales",
  "Juez Electoral",
  "Defensor del Pueblo",
  "Consejero Electoral"]

const place =
  ["de la nación",
    "del estado",
    "del municipio",
    "de la asamblea nacional",
    "del concejo municipal",
    "de la gobernación",
    "de la alcaldía",
    "del distrito",
    "de la comunidad",
    "de la universidad",
    "de la junta de vecinos",
    "de la organización no gubernamental",
    "del consejo comunal"]

function generatePositionName(){
  return position[faker.number.int({min:0, max:position.length-1})] + ' ' + place[faker.number.int({min:0, max:place.length-1})]
}

function generatePositionsToVote(positions){
  const q = faker.number.int({ min: 1, max: positions.length }); // Genera un número entre 1 y el tamaño del arreglo
  const shuffledPositions = faker.helpers.shuffle(positions); // Baraja el arreglo
  return shuffledPositions.slice(0, q).map(position => position.positionID); // Extrae los IDs
}


function generatePostulations(positions, parties){
  const q = faker.number.int({ min: 1, max: Math.min(4, parties.length, positions.length) }); // cantidad de postulaciones que va a tener el candidato
  const shuffledPositions = faker.helpers.shuffle(positions); // Baraja el arreglo
  const shuffledParties = faker.helpers.shuffle(parties); // Baraja el arreglo
  let postulations = [];
  for (let index = 0; index < q; index++) {
    let position = shuffledPositions[index];
    let postulation = {
      partyID: shuffledParties[index].partyID,
      positionID: position.positionID,
      postulationID: faker.string.uuid(),
    }
    postulations.push(postulation);
  }
  return postulations;
}

export { generatePositionName, generatePositionsToVote, generatePostulations };