import express from 'express'
import { notFound } from './middleware/notFound.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import connect from './config/db.js';
import dotenv from 'dotenv'
import adminRoute from './routes/adminRoute.js';
import publicRoute from './routes/publicRoute.js';

dotenv.config()


const app = express()
app.use(express.json())

app.use('/api/admin',adminRoute)
app.use('/api/public',publicRoute)

app.use(notFound)
app.use(errorHandlerMiddleware)


const start = async () => {
    try {
        connect(process.env.MONGO_URI)
        app.listen(3000, () => {
            console.log('app started');

        })
    } catch (error) {

    }
}
start()

