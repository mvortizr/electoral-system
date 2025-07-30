import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException
} from '@nestjs/common';
import { CouchdbService } from 'src/couchdb/src/couchdb/couchdb.service';
import * as nano from 'nano';

interface Vote {
  _id?: string;
  _rev?: string;
  multiplier: number;
  candidateID: string; // external
  positionID: string; // external
  partyID: string; // external
}

// --- NUEVA INTERFAZ PARA SOLUCIONAR EL ERROR ---
interface ViewParams {
  reduce?: boolean;
  group?: boolean;
  group_level?: number;
  startkey?: any; // Puede ser string, number, array, etc.
  endkey?: any;   // Puede ser string, number, array, etc.
  [key: string]: any; // Permite otras propiedades adicionales de vista si las usas
}
// --- FIN DE LA NUEVA INTERFAZ ---

@Controller('votes')
export class VotesController {
  private votesDb: nano.DocumentScope<Record<string, any>>;

  constructor(private readonly couchdbService: CouchdbService) {
    this.initDb();
  }

  async initDb() {
    try {
      this.votesDb = await this.couchdbService.getDb('votes');
      console.log("Conexión a 'votes' establecida.");
      await this.ensureDesignDoc(); // <--- Esta es la llamada crucial
      console.log("Verificación/creación del design document completada.");
    } catch (err) {
      console.error("Error durante la inicialización de la base de datos o el design document:", err.message);
      throw err;
    }
  }

   private async ensureDesignDoc() {
    const designDocName = 'votes_by_dimension';
    const viewName = 'countByDimension';
    const designDocId = `_design/${designDocName}`;

    try {
      // Intentar obtener el design document para ver si ya existe
      await this.votesDb.get(designDocId);
      console.log(`Design document "${designDocId}" ya existe en CouchDB.`);
    } catch (error) {
      // Si el error es 404 (Not Found), significa que no existe y lo creamos
      if (error.statusCode === 404) {
        console.log(`Design document "${designDocId}" no encontrado. Creándolo en CouchDB...`);

        // Aquí es donde el contenido del JSON se convierte en un objeto TypeScript
        const designDoc = {
          _id: designDocId, // El ID de este documento de diseño
          views: {
            [viewName]: { // El nombre de tu vista
              // La función 'map' como una cadena de texto JavaScript
              map: 'function(doc) { emit([doc.positionID, doc.candidateID, doc.partyID], doc.multiplier); }',
              // La función 'reduce' predefinida de CouchDB
              reduce: '_sum'
            }
          }
        };

        // Insertar (crear) el documento de diseño en la base de datos de CouchDB
        await this.votesDb.insert(designDoc);
        console.log(`Design document "${designDocId}" creado exitosamente en CouchDB.`);
      } else {
        // Otros errores al intentar acceder al design document
        console.error(`Error al verificar/crear design document "${designDocId}":`, error.message);
        throw error;
      }
    }
  }

  @Post()
  async create(@Body() vote: Vote) {
    if (!this.votesDb) await this.initDb();
    const response = await this.votesDb.insert(vote);
    return { message: 'Vote created', id: response.id, rev: response.rev };
  }

  @Get()
  async findAll() {
    if (!this.votesDb) await this.initDb();
    const response = await this.votesDb.list({ include_docs: true });
    return response.rows.map((row) => row.doc);
  }

 @Get('count')
async countVotes(
  @Query('positionID') positionID: string, // Ahora positionID es obligatorio y el único parámetro de consulta
) {
  // 1. Asegurarse de que la base de datos esté inicializada
  if (!this.votesDb) {
    await this.initDb();
  }

  // 2. Validación: positionID es requerido.
  if (!positionID) {
    throw new BadRequestException('El parámetro "positionID" es requerido.');
  }

  const designDocName = 'votes_by_dimension';
  const viewName = 'countByDimension';

  // 3. Opciones de consulta para CouchDB
  const queryOptions: ViewParams = {
    reduce: true,
    group_level: 3, // Queremos agrupar hasta el nivel de partido ([positionID, candidateID, partyID])
    startkey: [positionID], // Inicia la búsqueda con el positionID
    endkey: [positionID, {}, {}] // Termina con el positionID ({} es un comodín para cualquier valor)
  };

  // 4. Ejecutar la consulta en CouchDB
  const { rows } = await this.votesDb.view(designDocName, viewName, queryOptions);

  // 5. Procesar los resultados para obtener el formato deseado
  const result: any[] = [];
  const candidateMap = new Map<string, { candidateID: string; total_votes: number; parties: { partyID: string; total_votes: number }[] }>();

  for (const row of rows) {
    // La clave es un array: [positionID, candidateID, partyID]
    const [rowPositionID, rowCandidateID, rowPartyID] = row.key;
    const votes = row.value as number; // El valor ya es la suma debido a '_sum' y 'reduce: true'

    // Aunque el startkey/endkey ya filtran, es buena práctica tener una comprobación si el positionID es crucial.
    // En este caso, si la consulta está bien formada, rowPositionID siempre será igual al positionID de entrada.
    if (!candidateMap.has(rowCandidateID)) {
      candidateMap.set(rowCandidateID, {
        candidateID: rowCandidateID,
        total_votes: 0,
        parties: []
      });
    }

    const candidateEntry = candidateMap.get(rowCandidateID)!;
    candidateEntry.total_votes += votes; // Suma los votos al total del candidato
    candidateEntry.parties.push({ partyID: rowPartyID, total_votes: votes }); // Agrega el subtotal por partido
  }

  // Convertir el Map a un array de objetos para el resultado final
  candidateMap.forEach(value => result.push(value));

  return result;
}

}
