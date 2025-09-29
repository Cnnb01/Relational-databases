const router = require("express").Router();
const { User, Note } = require("../models");
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};
router.get("/", async (req, res) => {
  const notes = await Note.findAll();
  notes.forEach((b) =>
    console.log(`${b.id},${b.content},${b.important},${b.date}`),
  );
  console.log("HELLOOOOOOOOOOO", JSON.stringify(notes, null, 5)); //????
  res.json(notes);
});

// find a single note
router.get("/:id", noteFinder, async (req, res) => {
  // const note = await Note.findByPk(req.params.id);
  if (req.note) {
    console.log(req.note.toJSON());
    res.json(req.note);
  } else {
    res.status(400).end();
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne();
    const notes = await Note.create({ ...req.body, userId: user.id });
    return res.json(notes);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

//modifying a note
router.put("/:id", noteFinder, async (req, res) => {
  // const note = await Note.findByPk(req.params.id);
  if (req.note) {
    req.note.important = req.body.important;
    await req.note.save();
    res.json(req.note);
  } else {
    res.status(400).end();
  }
});

// delete a note
router.delete("/:id", noteFinder, async (req, res) => {
  // const note = await Note.findByPk(req.body.id);
  if (req.note) {
    await req.note.destroy();
  } else {
    res.status(400).end();
  }
});

module.exports = router;
