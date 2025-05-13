// server/src/index.ts
import express from 'express'
import { createUserAndDatabase } from './src/database/db.create'
import { AppDataSource } from './src/database/data-source'
import cors from 'cors'
import authRouter from './src/routes/auth.route'

export const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8000',
    // `http://${IP}:3000`,
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRouter)

createUserAndDatabase().then(() => {
    AppDataSource.initialize().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    }).catch(error => {
        console.error('Error during Data Source initialization: ', error);
    })
}).catch(error => {
    console.error('Error during db creation: ', error);
})
