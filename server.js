const express = require('express');
const router = require('./routes/routes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT;
const connectDb = require('./config/db');

const app = express();
app.use(cookieParser);
app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);
connectDb();

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`🚀 Ecom Web App Server is running on port ${PORT}`);
})