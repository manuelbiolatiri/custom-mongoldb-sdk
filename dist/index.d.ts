export declare class MongoSDKClient {
    dbUri: any;
    dbName: string;
    collectionName: string;
    port: number;
    client: any;
    db: any;
    io: any;
    constructor(dbUri?: string, dbName?: string, collectionName?: string, port?: number);
    testFunc(): string;
}
