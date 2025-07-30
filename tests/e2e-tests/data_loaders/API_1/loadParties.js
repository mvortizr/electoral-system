import fs from 'fs/promises';
import fetch from 'node-fetch';
import { API_KEY, BASE_URL } from '../consts.js';

async function postPartiesInBatches(batchSize = 100) {
  try {
    const dataRaw = await fs.readFile('../../generated_data/parties.json', 'utf-8');
    const parties = JSON.parse(dataRaw);

    const url = `${BASE_URL}/party/createPartyBatch`;

    // Función para dividir el arreglo en lotes
    function chunkArray(array, size) {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }

    const batches = chunkArray(parties, batchSize);
    console.log(`Total parties: ${parties.length}, sending in ${batches.length} batches.`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Sending batch ${i + 1} with ${batch.length} parties...`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'auth': API_KEY,
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
    console.error('Error posting parties in batches:', error);
    throw error;
  }
}

postPartiesInBatches();
