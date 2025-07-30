import fs from 'fs/promises';
import fetch from 'node-fetch';
import { API_KEY, BASE_URL } from '../consts.js';

async function postPositions(batchSize = 100) {
  try {
    const dataRaw = await fs.readFile('../../generated_data/positions.json', 'utf-8');
    const positions = JSON.parse(dataRaw);

    const url = `${BASE_URL}/position/createPositionBatch`;

    // Función para dividir el arreglo en lotes
    function chunkArray(array, size) {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }

    const batches = chunkArray(positions, batchSize);
    console.log(`Total positions: ${positions.length}, sending in ${batches.length} batches.`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Sending batch ${i + 1} with ${batch.length} positions...`);

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
    console.error('Error posting positions in batches:', error);
    throw error;
  }
}

postPositions();
