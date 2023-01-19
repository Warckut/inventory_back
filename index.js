require('dotenv').config()

const express = require('express');
const cors = require('cors')
const sequelize = require('./db')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/error-middleware');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;
const app = express()

app.use(fileUpload({}))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(errorHandler)

const start = async() => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ()=> console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()