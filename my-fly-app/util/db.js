const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: isProduction
    ? {
        ssl: {
          //Setting up secure connections, especially for cloud-hosted databases like AWS RDS, often involves specifying SSL options within dialectOptions.
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the db", error.message);
    console.log("THE ISSUE ISSS...", error.message);
    return process.exit(1);
  }
  return null;
};

module.exports = { connectToDatabase, sequelize };
