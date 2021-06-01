const mariadb = require('mariadb');
const fs = require('fs');
const path = './etc/database_config.json'

if (!fs.existsSync(path)) {
    // Create empty config object
    const connectionData = {
        host: "",
        user: "",
        port: 0,
        password: "",
        database: "",
    };

    // Convert Example object to JSON string
    const data = JSON.stringify(connectionData, null, 2);

    // Create and write example config file
    fs.writeFileSync(path, data, (err) => {
        if (err) console.log("Failed to create default database connection file");
    });

    // Termite the process with information message
    console.log("Config file is missing. Exampel file was created and the process will termite");
    process.exit();
}

// Read connection config file
const config = JSON.parse(fs.readFileSync(path, "utf8"));

// Create pool object
const pool = mariadb.createPool({
    host: config.host,
    user: config.user,
    port: config.port,
    password: config.password,
    database: config.database,
});

// Expose a promise to create a new connection
module.exports = {
    getConnection: function () {
        return new Promise(function (resolve, reject) {
            pool.getConnection()
                .then(function (connection) {
                    resolve(connection);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    },
};
