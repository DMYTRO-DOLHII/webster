import express from 'express'
import { createUserAndDatabase } from './src/database/db.create'
import { AppDataSource } from './src/database/data-source'
import cors from 'cors'
import authRouter from './src/routes/auth.route'
import projectRouter from './src/routes/project.route'
import userRouter from './src/routes/user.route'
import stripeRouter from './src/routes/stripe.route'

// Import stripeWebhookRouter (but apply raw body below)
import stripeWebhookRouter from './src/utils/stripeWebhook'
import { clear } from 'console'

export const app = express()
const PORT = process.env.PORT

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8000',
    // `http://${IP}:3000`,
]

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}

app.use(cors(corsOptions))

// 👉 Stripe webhook: needs raw body middleware BEFORE express.json()
app.use(
    '/webhook',
    express.raw({ type: 'application/json' }), // apply raw middleware
    stripeWebhookRouter
)

// Now apply express.json() to the rest of the app
app.use(express.json())

// Other API routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/stripe', stripeRouter)

createUserAndDatabase()
    .then(() => {
        AppDataSource.initialize()
            .then(() => {
                app.listen(PORT, () => {
                    console.log(`Server is running on http://localhost:${PORT}`)
                })
            })
            .catch((error) => {
                console.error('Error during Data Source initialization: ', error)
            })
    })
    .catch((error) => {
        console.error('Error during db creation: ', error)
    })
