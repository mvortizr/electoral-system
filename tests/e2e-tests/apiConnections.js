import fetch from "node-fetch";

const BASE_URL = 'http://channel1-api.localho.st';
const API_KEY = '10060b68-340b-4b8d-8844-c94a1afe3a04';

export async function checkHealth() {
    const url = `${BASE_URL}/checkHealth`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'api-key': API_KEY
        }
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
  
      const data = await response.json(); // or response.text() if not JSON
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('Error connecting to API:', error);
      throw error;
    }
  }