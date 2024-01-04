const notesUsers = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register a new user
const registerUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const existingUser = await notesUsers.findOne({ email });

    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    if (existingUser) {
      return res.status(400).send({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new notesUsers({
      email,
      password: hashedPassword,
      notes: [],
    });

    await newUser.save();

    res.status(201).send({
      message: "Registration Successful. Please Login",
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await notesUsers.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({  _id: user._id,email: user.email }, process.env.SECRET_KEY);
      return res.status(200).send({
        message: "Login Successful",
        token: token,
        userDetails: user,
      });
    } else {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
