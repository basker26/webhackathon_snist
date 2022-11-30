var mysql = require("mysql");
const PropertiesReader = require('properties-reader');
const prop = PropertiesReader('./server/properties.properties');

module.exports.getConnection = function() { 
	let connection;
	try {
        console.log("entered");
        connection = mysql.createConnection({
        	host: prop.get('database.mysql.host'),
	 		user: prop.get('database.mysql.user'),
	 		password: prop.get('database.mysql.password'),
	 		database: prop.get('database.mysql.db'),
			multipleStatements: prop.get('database.mysql.multipleStatements'),
			timezone : prop.get('database.mysql.timezone')
        });

    } catch (ex) {
        console.log("No connection "+ex);
        throw ex;
    }
    console.log("Database is connected.");
	return connection;
};
