//k6 run ch1_stress_test_v2.js


import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { API_KEY_1, BASE_URL_1 } from '../data_loaders/consts.js'

// 1. Configuration Constants (Update these for your environment)
const BASE_URL = BASE_URL_1;
const API_KEY = API_KEY_1;
const ENDPOINT = '/candidate/createCandidateBatch';
const BATCH_SIZE = 5; // The number of candidates sent in each request
const DATA_FILE_NAME = '../generated_data/candidates.json';

// 2. Load Existing Data
// K6 will load this file once and share it across all VUs.
// NOTE: Ensure your JSON file is named 'candidates.json' and is in the same folder.
const ALL_CANDIDATES = new SharedArray('allCandidates', function () {
    let rawData;
    
    // --- Step 1: Attempt to Read the File ---
    try {
        // Attempt to read the file using the specified filename
        // NOTE: The file must be in the same directory as this k6 script!
        rawData = open('../generated_data/candidates.json')
    } catch (e) {
        // This catches File Not Found or general read errors
        console.error(`ERROR: [File Read] Could not find or read the file named '${DATA_FILE_NAME}'. Check the path and file name.`);
        throw e; // Re-throw the error to halt the test setup
    }
    
    if (!rawData || rawData.trim().length === 0) {
        // This handles cases where the file exists but is empty
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
        // This catches JSON parsing errors specifically.
        console.error(`\n--- FATAL JSON PARSING ERROR ---\n`);
        console.error(`File: ${DATA_FILE_NAME}`);
        console.error(`Error Message: ${error.message}`);
        // Log a snippet of the start of the file to help debug errors like extra syntax
        console.error(`\nStart of file content (first 100 chars): ${rawData.substring(0, 100)}\n`);
        console.error(`--------------------------------\n`);
        throw error; // Re-throw the error to halt the test setup
    }
});

// Calculate the total number of candidates and the total batches needed globally
const TOTAL_CANDIDATES_COUNT = ALL_CANDIDATES.length;
const TOTAL_BATCHES_NEEDED = TOTAL_CANDIDATES_COUNT > 0 
    ? Math.ceil(TOTAL_CANDIDATES_COUNT / BATCH_SIZE) 
    : 0;

console.log(`Calculated total batches required for this data set: ${TOTAL_BATCHES_NEEDED}`);


// 3. Test Options (Updated to use Shared Iterations)
export let options = {
  // Use a 'shared-iterations' executor to run a fixed number of total iterations.
  scenarios: {
    batch_upload_scenario: {
      executor: 'shared-iterations',
      // Set the total number of iterations equal to the total batches needed.
      iterations: TOTAL_BATCHES_NEEDED, 
      vus: 10, // Number of concurrent users
      // A generous max duration just in case, but the run will stop when iterations finish.
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
  
  if (TOTAL_BATCHES_NEEDED === 0) {
      // Should not happen if data is loaded, but serves as a safety exit
      return; 
  }

  // Use the global iteration counter (__ITER) provided by 'shared-iterations'
  // to get the current batch number (0, 1, 2, ...).
  const batchIndex = __ITER; 

  const startIndex = batchIndex * BATCH_SIZE;
  const endIndex = startIndex + BATCH_SIZE;

  // Slice the data sequentially. The last slice might be smaller than BATCH_SIZE.
  const batchPayload = ALL_CANDIDATES.slice(startIndex, endIndex);

  // If the slice is empty (only happens if the data array was empty or logic error), skip.
  if (batchPayload.length === 0) {
      return;
  }

  const headers = {
    'auth': API_KEY,
    'Content-Type': 'application/json',
  };

  // Perform the POST request
  const res = http.post(url, JSON.stringify(batchPayload), { headers: headers });

if (res.status !== 201) {
    console.error(`Failed: ${res.status} - ${res.body}`);
  }  else {
    console.log (`Succeded: ${res.status} - ${res.body}`);
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
    'response time is fast': (r) => r.timings.duration < 1000,
  });

  // Wait for 0.5 seconds before the next iteration
  sleep(0.5);
}
