import fs from 'fs/promises';
import fetch from 'node-fetch';
import { API_KEY_2, BASE_URL_2 } from '../consts.js';

async function sendVotes() {
  try {
    const dataRaw = await fs.readFile('../../generated_data/votes.json', 'utf-8');
    const votes = JSON.parse(dataRaw);

    const url = `${BASE_URL_2}/vote/register`;

    console.log(`Total votes: ${votes.length}, sending them 1 by 1.`);

    for (let i = 0; i < votes.length; i++) {
      const vote = votes[i];
      console.log(`Sending vote ${i + 1}...`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'auth': API_KEY_2,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vote),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Vote ${i + 1} HTTP error! Status: ${response.status}, Body: ${errorText}`);
      }

      console.log(`Vote ${i + 1} sent successfully.`);
    }

    console.log('All batches sent successfully.');
    return 'Success';

  } catch (error) {
    console.error('Error posting votes:', error);
    throw error;
  }
}

sendVotes();
