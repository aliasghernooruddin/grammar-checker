import express from 'express';
import cors from 'cors';
import Routes from './routes/route.js'
import "dotenv/config";
const app = express();
const port = 3000;



// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());


// Example API route
app.use('/api/user', Routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
