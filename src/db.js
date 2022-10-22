import { MongoClient } from 'mongodb';

let db;

async function connectTodb(cb) {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();

    db = client.db('react-supportDesk');
    cb();
}

export {
    db,
    connectTodb
}