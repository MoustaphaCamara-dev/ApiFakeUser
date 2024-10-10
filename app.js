const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const generateRandomPassword = require("./passwordGenerator");

dotenv.config();

const app = express();
const serverPort = 3000;

app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
let userDatabase;

MongoClient.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((mongoClient) => {
    console.log("Connecté à MongoDB");
    userDatabase = mongoClient.db("userDB");
  })
  .catch(console.error);

const createFakeUser = async () => {
  const [firstNameData, lastNameData, domainData] = await Promise.all([
    userDatabase
      .collection("firstNames")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray(),
    userDatabase
      .collection("lastNames")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray(),
    userDatabase
      .collection("domains")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray(),
  ]);

  return {
    firstName: firstNameData[0].name,
    lastName: lastNameData[0].name,
    email: `${firstNameData[0].name.toLowerCase()}.${lastNameData[0].name.toLowerCase()}@${
      domainData[0].domain
    }`,
    password: generateRandomPassword(),
  };
};

app.get("/api/fake-user", async (req, res) => {
  try {
    const singleFakeUser = await createFakeUser();
    res.json(singleFakeUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/fake-users", async (req, res) => {
  try {
    const userCount = Math.max(1, parseInt(req.query.count) || 1);
    const multipleFakeUsers = await Promise.all(
      Array.from({ length: userCount }, createFakeUser)
    );
    res.json(multipleFakeUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(serverPort, () => {
  console.log(
    `ApiFakeUser en cours d'exécution sur http://localhost:${serverPort}`
  );
});
