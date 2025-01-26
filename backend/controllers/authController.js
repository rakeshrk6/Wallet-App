const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Wallet = require("../models/Wallet");

const signupController = async (req, res) => {
  try {
    const { Name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User is already registered");
    }

    //we stored the password as hash. To convert to hash we use library bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      Name,
      email,
      password: hashedPassword,
    });

    const wallet = await Wallet.create({ user: user._id });

    user.wallet = wallet._id;
    await user.save();
    return res.status(201).send(`${user.email} is registered`);
  } catch (e) {
    console.log(e);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User is not registered");
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(403).send("Incorrect password");
    }

    const accessToken = generateAccessTokens({
      _id: user._id,
    });

    const refreshToken = generateRefreshTokens({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      expires: new Date(Date.now() + 25892000000),
      sameSite: "none",
      secure: true,
      httpOnly: false,
    });

    return res.status(201).send({ user, accessToken });
  } catch (e) {
    console.log(e);
  }
};

// this api will check the refresh token validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    return res.status(401).send("Refresh token in cookie is required");
  }

  const refreshToken = cookies.jwt;
  console.log("refresh:", refreshToken);
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const _id = decoded._id;
    const accessToken = generateAccessTokens({ _id });

    return res.status(201).send({ accessToken });
  } catch (e) {
    console.log(e);

    return res.status(401).send("Invalid refresh key");
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).send("user logged out");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

//internal functions
const generateAccessTokens = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "20min",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};

const generateRefreshTokens = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "30d",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
};
