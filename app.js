const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const serverPort = 3000;

app.use(express.json());
app.use(cors());

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
  .catch((error) => console.error(error));

const getRandomPassword = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};

const createFakeUser = async () => {
  try {
    const firstName = await userDatabase
      .collection("firstNames")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();
    const lastName = await userDatabase
      .collection("lastNames")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();
    const domain = await userDatabase
      .collection("domains")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();

    const singleFakeUser = {
      firstName: firstName[0].name,
      lastName: lastName[0].name,
      email: `${firstName[0].name.toLowerCase()}.${lastName[0].name.toLowerCase()}@${
        domain[0].domain
      }`,
      password: getRandomPassword(),
    };

    return singleFakeUser;
  } catch (error) {
    throw new Error("Erreur lors de la génération de l'utilisateur fictif");
  }
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
    const userCount = parseInt(req.query.count) || 1;
    const multipleFakeUsers = [];

    for (let i = 0; i < userCount; i++) {
      const singleFakeUser = await createFakeUser();
      multipleFakeUsers.push(singleFakeUser);
    }

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
