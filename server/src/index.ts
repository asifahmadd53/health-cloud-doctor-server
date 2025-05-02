import express from 'express';
import dotenv from 'dotenv/config';

console.log('Starting server...');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
})




app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
})