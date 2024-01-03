const notesUsers = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register a new user
const registerUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const existingUser = await notesUsers.findOne({ email });
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "passwords do not match" });
    }
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    } else {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new notesUsers({
        email,
        password: hashedPassword,
        notes: [],
      });
      await newUser.save();
      // Messages are used to alert users to raise toast notifications.
      // After successful registration, users should navigate to the login page.
      res.status(201).json({
        message: "Registration Successful. Please Login",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
    console.log(error.message);
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await notesUsers.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {expiresIn: '30m'});
        return res.status(200).json({
          message: "Login Successful",
          token: token,
          userDetails: user,
        });
      } else {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
    } catch (error) {
      res.send({ message: "Internal server error" });
      console.log(error.message)
    }
};


