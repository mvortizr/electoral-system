import { Injectable } from '@nestjs/common';

@Injectable()
export class LifecycleService {
    async getMinimumApprovals(): Promise<any> {
        const API_1_URL = process.env.API_1_URL!;
        const url = `${API_1_URL}/config/getMinimumApproval`
        
        try {
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth': process.env.API_KEY!,
                }
            });

            // Check if the response status is not OK (2xx range)
            if (!response.ok) {
                const errorBody = await response.json(); // Read the body of the error response
                if (response.status === 400) {
                    // For 400 status, return the error body (response object)
                    return errorBody;
                } else {
                    // For other non-OK statuses, throw an error with the error body
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`);
                }
            }

        return await response.json();} catch (error) {
            console.error(`Error posting data: ${url}`, error);
            console.error(`URL ${url}`);
            throw error; // Re-throw the error so it can be handled by the caller
        }
    }

    async postData(url: string, data: any): Promise<any> {
        try {
            console.error(`URL ${url}`);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth': process.env.API_KEY!,
                },
                body: JSON.stringify(data),
            });

            // Check if the response status is not OK (2xx range)
            if (!response.ok) {
                const errorBody = await response.json(); // Read the body of the error response
                if (response.status === 400) {
                    // For 400 status, return the error body (response object)
                    return errorBody;
                } else {
                    // For other non-OK statuses, throw an error with the error body
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`);
                }
            }

            // Parse and return the response JSON for successful responses
            return await response.json();
        } catch (error) {
            console.error(`Error posting data: ${url}`, error);
            console.error(`URL ${url}`);
            throw error; // Re-throw the error so it can be handled by the caller
        }
    }

}
