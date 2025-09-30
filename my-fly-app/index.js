const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

app.use(express.json());

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// {
//   name: "SequelizeValidationError",
//   errors: [
//     {
//       message: "Username must be a valid email address",
//       type: "Validation error",
//       path: "username",
//       value: "notanemail"
//     }
//   ]
// }

//error handler middleware
const errorHandler = (error, req, res, next) => {
  if ((error.name = "SequelizeValidationError")) {
    return res.status(400).json({ error: error.errors.map((e) => e.message) });
  }
  next(error);
};
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();
