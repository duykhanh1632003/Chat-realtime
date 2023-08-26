const userModel = require("../Model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (_id) => {
  let jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (user)
      return res.status(200).json({
        errCode: 1,
        errMessage: "User with the given email already exists",
      });

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "All fields are required..." });

    if (!validator.isEmail(email))
      return res
        .status(200)
        .json({ errCode: 1, errMessage: "Email must be a valid email" });

    if (!validator.isStrongPassword(password))
      return res
        .status(200)
        .json({ errCode: 1, errMessage: "Password must be a strong password" });

    user = new userModel({ name, email, password });

    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    let token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token, errCode: 0 });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "Invalid Email or Password" });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res
        .status(200)
        .json({ errCode: 1, errMessage: "Invalid password" });

    let token = createToken(user._id);

    res
      .status(200)
      .json({ _id: user._id, name: user.name, email, token, errCode: 0 });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await userModel.find();

    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = {
  registerUser,
  createToken,
  loginUser,
  findUser,
  getUsers,
};
