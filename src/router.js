const controllers = require("./controllers");

const router = (app) => {
  app.get("/logout", controllers.Account.logout);

  app.post("/login", controllers.Account.login);
  app.post("/signup", controllers.Account.signup);
};

module.exports = router;
