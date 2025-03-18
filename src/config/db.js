import pkg from "pg"
import pgPromise from "pg-promise";
const { Pool } = pkg

export const pgp = pgPromise({
    capSQL: true, // Enable capitalized SQL syntax for better performance
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,  // Or use "postgres-db" if running inside Docker network
    database: process.env.DB_DATABASE,
    password:  process.env.DB_PASSWORD,  // Make sure this matches your ALTER USER command
    port: process.env.DB_PORT,
})

export const poolPromisified = pgp({
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 5432,
});

pool.on( "connect" , () => console.log("Connection with db is established") )

poolPromisified.connect()
    .then(obj => {
        console.log("Promisified Pool Connection with DB established");
        obj.done(); // Release the connection
    })
    .catch(error => {
        console.error("Error connecting Priomisfied Pool to the DB:", error);
    });

export default pool