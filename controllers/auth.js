const bcrypt = require("bcryptjs");

const User = require("../models/auth");

exports.getLogin = (req, res) => {
    let message = req.flash("err");
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
  res.render("login_registration",{
      errorMessage : message
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const psw = req.body.psw;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
          req.flash("err","Invalid Password or email");
        return res.redirect("/login");
      }
      return bcrypt.compare(psw, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(() => {
             res.redirect("/");
          });
        }
        return res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/login");
    });
};

exports.postLogout = (req,res) => {
    req.session.destroy(() => {
        res.redirect("/");
    })
}

exports.getRegister = (req, res) => {
  res.render("login_registration");
};

exports.postRegister = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const psw = req.body.psw;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/register");
      }

      return bcrypt.hash(psw, 12).then((hashPsw) => {
        const user = new User({
          name: name,
          email: email,
          password: hashPsw,
        });

        user
          .save()
          .then((result) => {
            console.log(result);
            req.session.isLoggedIn = true;
            req.session.user = result;
            res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getReset = (req, res) => {
  res.render("reset");
};

exports.postReset = (req, res) => {
  res.redirect("/login");
};
