import { MongoClient } from 'mongodb';
import { Server } from 'socket.io';

export class MongoSDKClient {
  public dbUri;
  public dbName: string;
  public collectionName: string;
  public port: number;
  public client;
  public db;
  public io;

  constructor(
    dbUri = '',
    dbName = 'nethub-dev',
    collectionName = 'reviews',
    port = 3001
  ) {
    this.dbUri = dbUri;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.port = port;

    this.client = new MongoClient(this.dbUri);
    this.db = this.client.db(this.dbName);
    this.io = new Server();

    console.log('db connected', this.db)

    this.io.on('connection', (socket) => {
      const collection = this.db.collection(this.collectionName);

      const changeStream = collection.watch();

      changeStream.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update') {
          socket.emit('data-change', change);
        }
      });
    });

    this.io.listen(this.port);
  }

  testFunc() {
    return 'test functiion'
  }
}
