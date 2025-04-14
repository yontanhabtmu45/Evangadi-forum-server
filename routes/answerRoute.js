const express = require('express')
const router = express.Router()

const { getAnswers, createAnswer } = require('../controller/answerController')

router.get("/:questionId", getAnswers);

router.post("/:questionId", createAnswer);

module.exports = router