// FIX: Add 'with { type: "json" }' to the import statement
import data from './candidates.json' with { type: 'json' };

console.log(`data length ${data.length}`);
const ids = data.map(d => d.candidateExternalID);
console.log(` lenght ids ${ids.length}`, new Set(ids).size);