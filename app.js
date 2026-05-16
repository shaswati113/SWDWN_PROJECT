const readline = require('readline');
const { getPasswordBySource } = require('./services/passwordService');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\nPASSWORD MANAGER\n');
console.log('1. Retrieve Password');

rl.question('Enter Option: ', (option) => {
    if (option === '1') {
        rl.question('Enter Source Name: ', async (source) => {
            await getPasswordBySource(source);
            rl.close();
        });
    } else {
        console.log('Invalid Option');
        rl.close();
    }
});