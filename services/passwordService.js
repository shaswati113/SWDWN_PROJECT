const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'passwordManager';

async function getPasswordBySource(source) {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        console.log('Connected to Database');
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const result = await collection.findOne({ source });
        if (result) {
            console.log('\nPassword Found');
            console.log('-------------------');
            console.log('Source   :', result.source);
            console.log('Username :', result.username);
            console.log('Password :', result.password);
        } else 
            console.log('\nNo password found for source:', source);
    } catch (error) {
        console.log('Database Error:', error.message);
    } finally {
        if (client) await client.close();
    }
}

module.exports = {
    getPasswordBySource
};