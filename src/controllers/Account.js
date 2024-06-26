const models = require("../models");

const { Account } = models;

const loginPage = (req, res) => res.render("login");

const logout = (req, res) => {
  req.session.destroy();
  res.json({ loggedOut: true });
};

const login = (req, res) => {
  const email = String(req.body.email);
  const password = String(req.body.password);

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  return Account.authenticate(email, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: "Wrong username or password" });
    }

    req.session.account = Account.toAPI(account);
    console.log(req.session);

    return res.json({ message: "Successful Login" });
  });
};

const signup = async (req, res) => {
  const email = String(req.body.email);
  const username = String(req.body.username);
  const password = String(req.body.password);

  if (!username || !password || !email) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const hash = await Account.generateHash(password);
    const newAccount = new Account({ email, username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    console.log(req.session);
    return res.json({ message: "Successful Signup" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username already in use!" });
    }
    return res.status(500).json({ error: "An error ocurred!" });
  }
};

const user = (req, res) => {
  try {
    const user = req.session.account;
    console.log(req.session);
    return res.json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error retrieving user!" });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  user,
};
