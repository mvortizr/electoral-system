import fs from 'fs/promises';
import fetch from 'node-fetch';
import { API_KEY_1, BASE_URL_1 } from '../consts.js';

export async function postElectorsInBatches(batchSize = 25) {
  try {
    const dataRaw = await fs.readFile('../../generated_data/electors.json', 'utf-8');
    const electors = JSON.parse(dataRaw);

    const url = `${BASE_URL_1}/elector/createElectorBatch`;

    // Función para dividir el arreglo en lotes
    function chunkArray(array, size) {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }

    const batches = chunkArray(electors, batchSize);
    console.log(`Total electors: ${electors.length}, sending in ${batches.length} batches.`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Sending batch ${i + 1} with ${batch.length} electors...`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'auth': API_KEY_1,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Batch ${i + 1} HTTP error! Status: ${response.status}, Body: ${errorText}`);
      }

      console.log(`Batch ${i + 1} sent successfully.`);
    }

    console.log('All batches sent successfully.');
    return 'Success';

  } catch (error) {
    console.error('Error posting electors in batches:', error);
  }}

  postElectorsInBatches();