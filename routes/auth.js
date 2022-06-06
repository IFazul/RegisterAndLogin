const express = require("express");

const authController = require("../controllers/auth");
const is_auth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/login",is_auth,authController.getLogin);
router.post("/login",is_auth,authController.postLogin);
router.post("/logout",authController.postLogout);

router.get("/register",is_auth,authController.getRegister);
router.post("/register",is_auth,authController.postRegister);

router.get("/reset",authController.getReset);
router.post('/reset',authController.postReset);

module.exports = router;