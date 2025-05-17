const express = require('express')
const router = express.Router()

const { getAnswers, createAnswer, getSingleQuestionAnswer } = require('../controller/answerController')

router.get("/answers/:questionId", getAnswers);

router.post("/:questionId", createAnswer);

router.get("/answers/:questionId/:answerId", getSingleQuestionAnswer);

module.exports = router