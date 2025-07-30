import fs from 'fs/promises'; // fs promises API for async/await
import fetch from 'node-fetch';
import { API_KEY_1, BASE_URL_1 } from '../consts.js';

export async function postElectionConfig() {
  try {
    const dataRaw = await fs.readFile('../../generated_data/electionConfig.json', 'utf-8');
    const data = JSON.parse(dataRaw);

    const url = `${BASE_URL_1}/config/setElectionConfig`;

    const response = await fetch(url, { 
      method: 'POST',
      headers: {
        'auth': API_KEY_1,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.statusText;

  } catch (error) {
    console.error('Error posting election config:', error);
    throw error;
  }
}

postElectionConfig();