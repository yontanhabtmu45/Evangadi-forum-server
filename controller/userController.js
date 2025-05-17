const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")



async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid from users WHERE username = ? or email = ?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already exists" });
    }
    if (password.length <= 7) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 character" });
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username,firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User successfully registered" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid, password FROM users WHERE email = ?",
      [email]
    );

    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credential" });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid password" });
    }

    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({username, userid}, process.env.JWT_SECRET, {expiresIn: "1d"})
    
    return res.status(StatusCodes.OK).json({msg: "user logged in successfully!", token, username});


  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}
async function checkUser(req, res) {
  const username = req.user.username
  const userid = req.user.userid
  res.status(StatusCodes.OK).json({msg: "valid user", username, userid})
}

const getUser = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const [user] = await dbConnection.query(
      "SELECT userId, username, email FROM users WHERE userId = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    res.status(StatusCodes.OK).json(user[0]); // Return the user details
  } catch (error) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
};



module.exports = { register, login, checkUser, getUser };
