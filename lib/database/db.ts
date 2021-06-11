import mariadb from 'mariadb';
import fs from 'fs';

const path = './etc/database_config.json';

if (!fs.existsSync(path)) {
    // Create empty config object
    const connectionData = {
        host: '',
        user: '',
        port: 0,
        password: '',
        database: ''
    };

    // Convert Example object to JSON string
    const data = JSON.stringify(connectionData, null, 2);

    try {
        // Create and write example config file
        fs.writeFileSync(path, data);
    } catch (error) {
        console.log('Failed to create example config file');
    }

    // Termite the process with information message
    console.log('Config file is missing. Exampel file was created and the process will termite');
    process.exit();
}

// Read connection config file
const config = JSON.parse(fs.readFileSync(path, 'utf8'));

// Create pool object
const pool = mariadb.createPool({
    host: config.host,
    user: config.user,
    port: config.port,
    password: config.password,
    database: config.database
});

// Expose a promise to create a new connection
export function getConnection (): Promise<mariadb.PoolConnection> {
    return new Promise((resolve, reject) => {
        pool.getConnection()
            .then(function (connection) {
                resolve(connection);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}
