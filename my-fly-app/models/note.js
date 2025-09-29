const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class Note extends Model {}
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true, //If, on the other hand, the name of the model would be "two-part", e.g. StudyGroup, then the name of the table would be study_groups.
    timestamps: false, //timestanpms are like created_at and updated_at
    modelName: "note",
  },
);

module.exports = Note;
