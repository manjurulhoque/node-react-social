import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Set test environment variables
process.env.JWT_SECRET = "test-secret-key";
process.env.NODE_ENV = "test";

let mongod: MongoMemoryServer;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
});
