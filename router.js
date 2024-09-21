const express = require("express");
const router = express.Router();

const User = require("./controllers/User_Controller");

router.get("/user/findAll", (req, res) => new User(req, res).findAll());
router.get("/user/findOne/:id", (req, res) =>
  new User(req, res).findOne(req.params.id)
);
router.post("/user/create", (req, res) => new User(req, res).create());
router.put("/user/update/:id", (req, res) =>
  new User(req, res).update(req.params.id)
);
router.delete("/user/delete/:id", (req, res) =>
  new User(req, res).delete(req.params.id)
);

module.exports = router;
