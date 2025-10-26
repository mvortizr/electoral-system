// k6 run ch1_stress_test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { API_KEY_1, BASE_URL_1 } from '../data_loaders/consts.js'

// Load candidate data once per test (shared across VUs)
const candidates = new SharedArray('candidates', function () {
  return JSON.parse(open('../generated_data/candidates.json'));
});

// Configuration
const BASE_URL = BASE_URL_1
const API_KEY = API_KEY_1
const BATCH_SIZE = parseInt(__ENV.BATCH_SIZE || '25');

// Utility to split array into chunks
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  console.log(result[0])
  return result;
}

const batches = chunkArray(candidates, BATCH_SIZE);

// Test options (configure load pattern)
export const options = {
  stages: [
    { duration: '15s', target: 10 },   // ramp up to 10 VUs
    { duration: '30s', target: 10 },   // sustain load
    { duration: '10s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'], // <5% of requests should fail
    http_req_duration: ['p(95)<1000'], // 95% of requests <1s
  },
};

// Main test
export default function () {
  // Random batch per iteration
  const batch = batches[Math.floor(Math.random() * batches.length)];

  const res = http.post(`${BASE_URL}/candidate/createCandidateBatch`, JSON.stringify(batch), {
    headers: {
      'Content-Type': 'application/json',
      'auth': API_KEY,
    },
  });

  if (res.status !== 201) {
    console.error(`❌ Failed: ${res.status} - ${res.body}`);
  }


  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(1);
}
