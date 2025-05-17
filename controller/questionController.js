const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

async function questions(req, res) {
  try {
    const { title, description, tag } = req.body;
    const userId = req.user.userId; // Ensure userId is extracted from req.user
    if (!title || !description || !tag) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please provide all required fields" });
    }

    // Check if the question already exists for the same user
    const [existingQuestion] = await dbConnection.query(
      "SELECT * FROM questions WHERE title = ? AND userId = ?",
      [title, userId]
    );
    if (existingQuestion.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Question with the same title already exists" });
    }

    const questionId = uuidv4();
    await dbConnection.query(
      "INSERT INTO questions (questionId, title, description, tag, userId) VALUES (?,?,?,?,?)",
      [questionId, title, description, tag, userId]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "question posted successfully" });
  } catch (error) {
    console.log(error.message);
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Question already exists" });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function getQuestion(req, res) {
  try {
    const userId = req.user.userId; 

    
    const [rows] = await dbConnection.query(
      "SELECT * FROM questions WHERE userId = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found" });
    }

    return res.status(StatusCodes.OK).json(rows); 
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function getAllUsersQuestions(req, res) {
  try {
    // Query all questions from all users
    const [rows] = await dbConnection.query("SELECT * FROM questions");

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found" });
    }

    return res.status(StatusCodes.OK).json(rows); // Return all questions
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function getSingleQuestion(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }
    return res.status(StatusCodes.OK).json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

module.exports = {
  questions,
  getQuestion,
  getAllUsersQuestions,
  getSingleQuestion,
};
