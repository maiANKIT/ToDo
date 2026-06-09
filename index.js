const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 4000;

app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const todoRoutes = require('./routes/todos');
const userRoutes = require('./routes/user');

app.use('/api/v1/todo', todoRoutes);
app.use('/api/v1/user', userRoutes);

const {connect} = require('./config/database');
connect();

app.get('/', (req, res)=>{
    res.send('backend working');
});

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
});

