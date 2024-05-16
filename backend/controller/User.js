const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
  }
};

const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).send({ message: "Password does not match" });

  const hashedPassword = await bcrypt.hashSync(password, 10);

  try {
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.status(201).send({
      message: "Register Berhasil",
      data: user,
    });
  } catch (error) {
    console.error(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const getUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!getUser) return res.status(400).send({ message: "User not found" });
    const comparedPassword = bcrypt.compareSync(password, getUser.password);

    if (!comparedPassword) {
      res.status(401).json({ message: "Wrong password" });
    }

    const { id: userId, name } = getUser;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await User.update(
      { refreshToken: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.send({ message: "Login Berhasil", accessToken: accessToken });
  } catch (error) {
    return res.send(error);
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findAll({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await User.update(
    { refreshToken: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

module.exports = { getUsers, register, login, logout };
