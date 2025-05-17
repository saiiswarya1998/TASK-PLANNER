require('dotenv').config();
require('express-async-errors');

//express
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

//public
app.use(express.static('./public'))
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//middleware

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler')

//db
const connectDB = require('./db/connect');

// Router
const authRouter = require('./router/authRoutes');
const userRouter = require('./router/userRoutes');

//Mapping

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.use(notFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000;

const start = async() =>
{
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port, ()=>
      {
        
        console.log(`Server listening at ${port}`)
    });

}

catch(error)
{
    console.log(`There is an error : ${error}`)
}
}

start();