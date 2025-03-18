import pool from "../config/db.js";

const queryText = `
CREATE TABLE IF NOT EXISTS users (
     "name" varchar NOT NULL,
     age int4 NOT NULL,
     address jsonb NULL,
     additional_info jsonb NULL,
    id serial4 NOT NULL
)
`

export const createUserTable = async () => {
    try {
       await pool.query(queryText)
       console.log("User Table created if not exists")
    } catch (err) {
       console.log("Error while creating user table")
    }   
}