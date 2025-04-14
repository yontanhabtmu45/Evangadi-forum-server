const express = require('express')
const app = express()
const port = 5700;
const cors = require('cors')

app.use(cors())

// db connection
const dbConnection = require('./db/dbConfig')



// authentication middleware
const authMiddleware = require('./middleware/authMiddleware')


// user route middleware file
const userRoutes = require('./routes/userRoute')

// question route middleware file
const questionRoute = require('./routes/questionRoute')

// answer route middleware file
const answerRoute = require('./routes/answerRoute')


// json middleware to extract json data
app.use(express.json())



// user route middleware
app.use('/api/users', userRoutes)


// question route middleware
app.use('/api/question', authMiddleware, questionRoute)


// answer route middleware
app.use('/api/answer',authMiddleware, answerRoute)




async function start() {
    try {
        const result = await dbConnection.execute("select  'test' ")
        await app.listen(port) 
        console.log('Database connection established')
        console.log(`Listening to ${port}`)
    } catch (error) {
        console.log(error.message)
    }
}
start()

