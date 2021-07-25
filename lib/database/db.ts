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
    console.log('Possible database connection file created in etc folder. ' +
        'If no environment variables are set, make sure to write the connection data in the config file and restart the application');
}

// Read connection config file
const config = JSON.parse(fs.readFileSync(path, 'utf8'));

// Create pool object
const pool = mariadb.createPool({
    host: process.env.DB_HOST || config.host,
    user: process.env.DB_USER || config.user,
    port: process.env.DB_PORT || config.port,
    password: process.env.DB_PASSWORD || config.password,
    database: process.env.DATABASE || config.database
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
