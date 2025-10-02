const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");

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
// const sequelize = new Sequelize(DATABASE_URL);
const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: "migrations/*.js",
    },
    storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
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
