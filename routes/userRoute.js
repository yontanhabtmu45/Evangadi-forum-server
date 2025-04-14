const express = require('express')
const router = express.Router()

// authentication middleware
const authMiddleware = require('../middleware/authMiddleware')


const {register, login, checkUser, getUser} = require('../controller/userController')



//  registration route
router.post('/register', register)


// login user
router.post('/login', login)



// check user
router.get('/users/check', authMiddleware, checkUser)


// get user
router.get("/me", authMiddleware, getUser);


module.exports = router