const router = require("express").Router();

const { Note, User } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      //join query is done using the include option
      model: Note,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

// PUT api/users/:username (changing a username, keep in mind that the parameter is not id but username)
// modifiying a user's username
router.put("/:username", async (req, res) => {
  const ourUser = await User.findOne({
    where: { username: req.params.username },
  });
  if (ourUser) {
    ourUser.username = req.body.username;
    await ourUser.save();
    res.json(ourUser);
  } else {
    res.status(400).end();
  }
});

module.exports = router;
