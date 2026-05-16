const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'passwordManager';
async function createIndex() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(dbName);
        await db.collection('passwords').createIndex({ source: 1 });
        console.log('Index Created Successfully');
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
}
createIndex();