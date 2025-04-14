const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

const getAnswers = async (req, res) => {
  const { questionId } = req.params; // Extract questionId from the request parameters
  try {
    const [answers] = await dbConnection.query(
        "SELECT * FROM answers WHERE questionId = ?", [questionId]
    ); // Fetch answers for the specific questionId

    if (answers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No answers found for this question" });
    }

    res.status(StatusCodes.OK).json(answers); // Return the answers
  } catch (error) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong, try again later!" });
  }
};

const createAnswer = async (req, res) => {
    const { answer } = req.body; 
    const { questionId } = req.params; 
    // const questionId = req.params.questionId;
    const userId = req.user.userId; // Get the userId from the authenticated user
    const answerId = uuidv4(); // Generate a unique ID for the answer
  
    try {
        const [existingAnswer] = await dbConnection.query(
          "SELECT * FROM answers WHERE answer = ?",
          [answer]
        );
        if(existingAnswer.length > 0){
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Answer already exists" });
        }
    await dbConnection.query(
      "INSERT INTO answers (answerid, userId, questionid, answer) VALUES (?, ?, ?, ?)",
      [answerId, userId, questionId, answer]
    );
      if(answer.length === 0){
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: "Answer cannot be empty" });
      } 
      res
        .status(StatusCodes.CREATED)
        .json({ msg: "Answer created successfully" });

    } catch (error) {
      console.error(error.message);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Something went wrong, try again later!" });
    }
  };
module.exports = {
  getAnswers,
  createAnswer,
};
