const { MongoClient } = require('mongodb');
const { Server } = require('socket.io');

class DataChangeListener {
  constructor(
    dbUri = 'mongodb+srv://developer:iE4l8bt1iCQTWsng@nethub.7r6ta.mongodb.net/nethub-dev?retryWrites=true&w=majority',
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

//   listen(eventName) {
//     return this.io.socket.listen listen(eventName);
//   }

//     listen(eventName) {
//     return this.io.listen(eventName);
//   }
}

module.exports = DataChangeListener;
