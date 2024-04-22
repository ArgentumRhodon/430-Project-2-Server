const controllers = require("./controllers");

const router = (app) => {
  app.get("/logout", controllers.Account.logout);
  app.get("/user", controllers.Account.user);

  app.post("/login", controllers.Account.login);
  app.post("/signup", controllers.Account.signup);
};

module.exports = router;
