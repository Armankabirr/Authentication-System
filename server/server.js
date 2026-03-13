import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' // Adjust this to your frontend URL
}));


app.get('/', (req, res) => {
    res.send('Hello from the server! working fine');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
