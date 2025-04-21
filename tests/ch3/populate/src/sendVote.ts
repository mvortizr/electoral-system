import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import axios from 'axios';
import * as fs from 'fs/promises'; // Use promises version for async/await
import * as path from 'path';

import { storeVoteDTO } from '../../../../api/channel3/src/modules/vote/dtos/storeVoteDTO'; 

require('dotenv').config();

const SERVER_URL = process.env.SERVER_URL || ""
const API_KEY = process.env.API_KEY || ""

async function sendVote(payload: any, index: number) {
  const instance = plainToInstance(storeVoteDTO, payload);
  const errors = await validate(instance);

  if (errors.length > 0) {
    console.error(`Validation failed for vote #${index + 1}:`, errors);
    return;
  }

  try {
    const response = await axios.post(`${SERVER_URL}/vote/save`, instance, {
        headers: {
          'auth': API_KEY,
          'Content-Type': 'application/json', 
        },
      });
    console.log(`Vote #${index + 1} sent successfully:`, response.data);
  } catch (error) {
    console.error(`Error sending vote #${index + 1}:`, error);
  }
}

async function main() {
  try {
  const filePath = path.join(__dirname, 'mock_data', 'vote_data.json');
  const data = await fs.readFile(filePath, 'utf-8');
  const votePayloads = JSON.parse(data);
    for (let i = 0; i < votePayloads.length; i++) {
      await sendVote(votePayloads[i], i);
    }
  } catch(error) {
    console.error('Error reading or parsing votePayloads.json:', error);
  }

 
}

main();
