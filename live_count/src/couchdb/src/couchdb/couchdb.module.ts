import { Module, Global } from '@nestjs/common';
import { CouchdbService } from './couchdb.service';
import * as nano from 'nano';

@Global() // Para que el servicio sea accesible en toda la aplicación
@Module({
  providers: [
    {
      provide: 'COUCHDB_CONNECTION',
      useFactory: () =>
        nano('http://admin:Cm97AfvnNK5&uY@my-couchdb:5984'),
    },
    CouchdbService,
  ],
  exports: [CouchdbService, 'COUCHDB_CONNECTION'],
})
export class CouchdbModule {}
