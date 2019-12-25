const express = require("express");
const bcrypt = require("bcrypt");
const { sessionChecker } = require("../middleware/auth");
const User = require("../models/users");
const Party = require("../models/partys");


const saltRounds = 10;
const router = express.Router();

let isLogin = true;
let isUnique = true;

router.get("/", sessionChecker, (req, res) => {
  res.redirect("/login");
});

router
  .route("/new")
  .get((req, res) => {
    res.render("newparty");
  })
  .post(async (req, res) => {
    try {
      const { name, location, starts} = req.body;
      const party = new Party({
        name,
        location,
        starts,
      });
      await party.save();
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error)
    }
  });

router
  .route("/signup")
  .get(sessionChecker, (req, res) => {
    res.render("signup",{isUnique});
  })
  .post(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({
        username,
        email,
        password: await bcrypt.hash(password, saltRounds)
      });
      await user.save();
      req.session.user = user;
      res.redirect("/dashboard");
    } catch (error) {
      isUnique = false;
      res.redirect('/signup')
    }
  });



router
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.render("login",{isLogin});
  })
  .post(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.redirect("/dashboard");
    } else {
      isLogin = false;
      res.redirect("/login");
      //alert('Неверный логин или пароль');
    }
  });

router.get("/dashboard", async(req, res) => {
  const { user } = req.session;
  const party = await Party.find({});
  if (req.session.user) {
    res.render("dashboard", { name: user.username ,party});
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    try {
      await req.session.destroy();
      res.clearCookie("user_sid");
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  } else {
    res.redirect("/login");
  }
});
router.get('/party/:id',async (req,res,next) => {
  const party = await Party.findOne({_id: req.params.id});
  console.log(party)
  res.render("party", party)
})

module.exports = router;
