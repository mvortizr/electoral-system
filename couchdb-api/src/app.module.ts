import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsController } from './items/items.controller'; // Agrega esta línea
import { CouchdbModule } from './couchdb/src/couchdb/couchdb.module';

@Module({
  imports: [CouchdbModule],
  controllers: [AppController, ItemsController], // Agrega ItemsController aquí
  providers: [AppService],
})
export class AppModule {}
