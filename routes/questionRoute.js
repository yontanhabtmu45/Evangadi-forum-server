const express = require('express')
const router = express.Router()


const {questions, getQuestion, getAllUsersQuestions, getSingleQuestion} = require('../controller/questionController')

router.post("/post-question", questions)


router.get("/my-question", getQuestion)

router.get("/all-questions", getAllUsersQuestions)


router.get("/:id", getSingleQuestion);



module.exports = router