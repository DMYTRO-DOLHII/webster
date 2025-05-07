// server/src/index.ts
import express from 'express'
import cors from 'cors'

export const app = express()
const PORT = process.env.PORT || 8000;

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

app.get('/api/hello', (_req, res) => {
	res.json({ message: 'Hello from backend!' })
})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
