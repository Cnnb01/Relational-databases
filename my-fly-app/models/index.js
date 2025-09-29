const Note = require("./note");
const User = require("./user");

User.hasMany(Note);
Note.belongsTo(User);
Note.sync({ alter: true }); //creates the table note if it doesn't exist
User.sync({ alter: true });

module.exports = {
  Note,
  User,
};
