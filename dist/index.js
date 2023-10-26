"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoSDKClient = void 0;
const mongodb_1 = require("mongodb");
const socket_io_1 = require("socket.io");
class MongoSDKClient {
    constructor(dbUri = 'mongodb+srv://developer:iE4l8bt1iCQTWsng@nethub.7r6ta.mongodb.net/nethub-dev?retryWrites=true&w=majority', dbName = 'nethub-dev', collectionName = 'reviews', port = 3001) {
        this.dbUri = dbUri;
        this.dbName = dbName;
        this.collectionName = collectionName;
        this.port = port;
        this.client = new mongodb_1.MongoClient(this.dbUri);
        this.db = this.client.db(this.dbName);
        this.io = new socket_io_1.Server();
        console.log('db connected', this.db);
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
        return 'test functiion';
    }
}
exports.MongoSDKClient = MongoSDKClient;
//# sourceMappingURL=index.js.map