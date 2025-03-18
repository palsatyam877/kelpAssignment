import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import pool from './config/db.js'
import userRoutes from './routes/userRoute.js'
import { errotHandling } from './middleware/errorHandling.js'
import { createUserTable } from './data/createUserTable.js'

const app = express();
const port = process.env.PORT || 3001

app.use(express.json())
app.use(cors())

// Routes
app.use("/api" , userRoutes )

// Testing database connection
app.get("/" , async(req , res) => {
    console.log("start");
    const result = await pool.query("SELECT current_database()") 
    console.log("end")

    res.send(`The database name is : ${result.rows[0].current_database}`)
})

// Error Handling Middlewares

app.use(errotHandling)

// creating Table
createUserTable()

// Server Running 
app.listen( port , () => console.log(`app is listening on port ${port}`) )