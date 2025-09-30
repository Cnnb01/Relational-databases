const router = require("express").Router();
const { User, Note } = require("../models");
const { Op } = require("sequelize");
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization"); //look for an Authorization header ie Authorization: Bearer <JWT>
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    //ensures the header: exists & starts with "bearer " (case-insensitive)
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET); //extracts the token part using authorization.substring(7) (skips the Bearer prefix). & verifies the token using jwt.verify(token, SECRET)
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};
router.get("/", async (req, res) => {
  let important = {
    [Op.in]: [true, false], // in->allows you to specify multiple values in a list and retrieve records where a particular column's value matches any of the values in that list.
  };
  if (req.query.important) {
    important = req.query.important === "true";
  }
  const notes = await Note.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where: {
      important,
    },
  });
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

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const note = await Note.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
    return res.json(note);
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
router.delete("/:id", tokenExtractor, noteFinder, async (req, res) => {
  // const note = await Note.findByPk(req.body.id);
  if (!req.note) {
    return res.status(404).json({ error: "note not found" });
  }
  if (req.note.userId !== req.decodedToken.id) {
    return res
      .status(403)
      .json({ error: "you are not authorized to delete this note" });
  } else {
    await req.note.destroy();
    res.status(200).end();
  }
});

module.exports = router;
