// k6 run ch2_execute_vote.js --out json=results.json


import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { BASE_URL_2, API_KEY_2 } from '../../data_loaders/consts.js'

// 1. Configuration Constants (Update these for your environment)
const BASE_URL = BASE_URL_2;
const API_KEY = API_KEY_2;
// *** MODIFICATION: New Endpoint ***
const ENDPOINT = '/vote/register'; 
// The following constant is no longer needed but kept for context if you switch back
// const BATCH_SIZE = 5; 
const DATA_FILE_NAME = '../../generated_data/votes.json';
const VU_NUMBER = 50;

// 2. Load Existing Data (The loading logic remains the same)
// K6 will load this file once and share it across all VUs.
const ALL_VOTES = new SharedArray('allVotes', function () {
    let rawData;
    
    // --- Step 1: Attempt to Read the File ---
    try {
        rawData = open(DATA_FILE_NAME);
    } catch (e) {
        console.error(`ERROR: [File Read] Could not find or read the file named '${DATA_FILE_NAME}'. Check the path and file name.`);
        throw e;
    }
    
    if (!rawData || rawData.trim().length === 0) {
        console.error(`ERROR: [Empty File] The file '${DATA_FILE_NAME}' was read but appears to be empty.`);
        return [];
    }

    // --- Step 2: Attempt to Parse the JSON ---
    try {
        const data = JSON.parse(rawData);
        
        if (!Array.isArray(data) || data.length === 0) {
             console.error(`ERROR: [Invalid Content] File '${DATA_FILE_NAME}' was parsed, but the content is not a valid JSON array or the array is empty.`);
             return [];
        }
        console.log(`Successfully loaded ${data.length} candidates from the data file.`);
        return data;
    } catch (error) {
        console.error(`\n--- FATAL JSON PARSING ERROR ---\n`);
        console.error(`File: ${DATA_FILE_NAME}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`\nStart of file content (first 100 chars): ${rawData.substring(0, 100)}\n`);
        console.error(`--------------------------------\n`);
        throw error;
    }
});

// Calculate the total number of candidates globally
const TOTAL_VOTES_COUNT = ALL_VOTES.length;

console.log(`Calculated total candidates to create: ${TOTAL_VOTES_COUNT}`);


// 3. Test Options (Updated for one iteration per candidate)
export let options = {
  // *** MODIFICATION: Use 'shared-iterations' with TOTAL_VOTES_COUNT ***
  // Each iteration now corresponds to sending ONE candidate.
  scenarios: {
    single_upload_scenario: {
      executor: 'shared-iterations',
      // Set the total number of iterations equal to the total number of candidates.
      iterations: TOTAL_VOTES_COUNT, 
      vus: VU_NUMBER, // Number of concurrent users
      maxDuration: '30m', 
      gracefulStop: '10s',
    },
  },
  thresholds: {
    // 95% of requests must complete within 1500ms
    http_req_duration: ['p(95)<1500'],
    // 99% of requests must succeed (status 200 or 201)
    checks: ['rate>0.99'],
  },
};

// 4. Main K6 execution function
export default function () {
  const url = `${BASE_URL}${ENDPOINT}`;
  
 if (TOTAL_VOTES_COUNT === 0) {
      return; 
  }

  // __VU: Virtual User ID (1 to VU_NUMBER)
  // __ITER: Local iteration count for this VU (0, 1, 2, ...)
  
  // *** MODIFICATION: Data Sharding Logic ***
  // Calculate a unique index: offset by VU ID, then add the product of local iteration and VU count.
  // Example (VU_NUMBER=10):
  // VU 1, ITER 0 -> Index 0
  // VU 2, ITER 0 -> Index 1
  // ...
  // VU 1, ITER 1 -> Index 10
  const voteIndex = (__VU - 1) + __ITER * VU_NUMBER;

  // Safety check: if the calculated index is beyond the length of the data array, exit.
  // This handles the remainder when TOTAL_VOTES_COUNT is not divisible by VU_NUMBER.
  if (voteIndex >= TOTAL_VOTES_COUNT) {
      return;
  }
  
  // *** MODIFICATION: Get a single candidate payload ***
  const votePayload = ALL_VOTES[voteIndex];

  // If the candidate object is undefined, skip.
  if (!votePayload) {
      // Log this as a serious data integrity issue if it happens after the bounds check
      console.error(`FATAL: Candidate payload is undefined for index ${voteIndex}.`);
      return;
  }

  const headers = {
    'auth': API_KEY,
    'Content-Type': 'application/json',
  };

  // Perform the POST request with the single candidate object
  const res = http.post(url, JSON.stringify(votePayload), { headers: headers });

  if (res.status !== 201) {
    console.error(`INDEX = ${voteIndex}, ITER = ${__ITER}, VU = ${__VU},  FAILED: ${res.status} - ${res.body}`);
  }  else {
    console.log (`INDEX = ${voteIndex}, ITER = ${__ITER}, VU = ${__VU},  SUCCEEDED: ${res.status} -  ${res.body}`);
  }

  // 5. Verification checks
  check(res, {
    'is status 200 or 201': (r) => r.status === 200 || r.status === 201,
    'is JSON response': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch (e) {
        if (r.status >= 400) console.error(`Failed request body: ${r.body}`);
        return false;
      }
    },
    'response time is fast': (r) => r.timings.duration < 7000,
  });

  // Wait for 0.5 seconds before the next iteration
  sleep(0.5);
}