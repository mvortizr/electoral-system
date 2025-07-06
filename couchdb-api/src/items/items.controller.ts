import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CouchdbService } from 'src/couchdb/src/couchdb/couchdb.service';
import * as nano from 'nano';

interface Item {
  _id?: string;
  _rev?: string;
  name: string;
  description: string;
}

@Controller('items')
export class ItemsController {
  private itemsDb: nano.DocumentScope<Record<string, any>>;

  constructor(private readonly couchdbService: CouchdbService) {
    this.initDb();
  }

  async initDb() {
    this.itemsDb = await this.couchdbService.getDb('items'); // Crea o usa la base de datos 'items'
  }

  @Post()
  async create(@Body() item: Item) {
    if (!this.itemsDb) await this.initDb();
    const response = await this.itemsDb.insert(item);
    return { message: 'Item created', id: response.id, rev: response.rev };
  }

  @Get()
  async findAll() {
    if (!this.itemsDb) await this.initDb();
    const response = await this.itemsDb.list({ include_docs: true });
    return response.rows.map((row) => row.doc);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!this.itemsDb) await this.initDb();
    const item = await this.itemsDb.get(id);
    return item;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() item: Item) {
    if (!this.itemsDb) await this.initDb();
    const existingItem = await this.itemsDb.get(id);
    const response = await this.itemsDb.insert({
      ...item,
      _id: id,
      _rev: existingItem._rev,
    });
    return { message: 'Item updated', id: response.id, rev: response.rev };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!this.itemsDb) await this.initDb();
    const existingItem = await this.itemsDb.get(id);
    const response = await this.itemsDb.destroy(id, existingItem._rev);
    return { message: 'Item deleted', id: response.id, rev: response.rev };
  }
}
