import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VotesController } from './votes/votes.controller'; // Agrega esta línea
import { CouchdbModule } from './couchdb/src/couchdb/couchdb.module';

@Module({
  imports: [CouchdbModule],
  controllers: [AppController, VotesController], // Agrega VotesController aquí
  providers: [AppService],
})
export class AppModule {}
