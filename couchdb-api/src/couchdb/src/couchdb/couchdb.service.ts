/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Inject } from '@nestjs/common';
import * as nano from 'nano';

@Injectable()
export class CouchdbService {
  // The 'connection' is the ServerScope which allows managing databases
  constructor(
    @Inject('COUCHDB_CONNECTION') private readonly connection: nano.ServerScope,
  ) {
    // The constructor is clean. Specific database instances will be obtained
    // via the getDb method, which allows for dynamic database selection.
  }

  /**
   * Retrieves a CouchDB database instance by name.
   * If the database does not exist, it attempts to create it.
   *
   * @param dbName The name of the CouchDB database.
   * @returns A Promise resolving to a nano.DocumentScope<Record<string, any>> for the specified database.
   * The Record<string, any> type parameter signifies that documents are generic objects.
   */
  async getDb(
    dbName: string,
  ): Promise<nano.DocumentScope<Record<string, any>>> {
    try {
      // Attempt to get the database info to check if it exists
      await this.connection.db.get(dbName);
    } catch (error: any) {
      // Use 'any' for the error type for broader compatibility
      // If the database is not found (status code 404), create it
      if (error.statusCode === 404) {
        await this.connection.db.create(dbName);
        console.log(
          `[CouchdbService] Database '${dbName}' created successfully.`,
        );
      } else {
        // Re-throw any other type of error (e.g., connection issues, permissions)
        console.error(
          `[CouchdbService] Error accessing or creating database '${dbName}':`,
          error,
        );
        throw error;
      }
    }
    // Return a DocumentScope instance for the specified database
    // We use Record<string, any> as the document type because this service is generic
    return this.connection.use<Record<string, any>>(dbName);
  }
}
