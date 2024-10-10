const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const getRandomPassword = require("./passwordGenerator"); // Importer la fonction

dotenv.config(); // Charger les variables d'environnement

const app = express();
const port = 3000;

// Middleware pour analyser le corps des requêtes en JSON
app.use(express.json());

// Connexion à MongoDB
const uri = process.env.MONGODB_URI;
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("Connecté à MongoDB");
    db = client.db("userDB"); // Accéder à la base de données userDB
  })
  .catch(console.error);

// Fonction pour créer un faux utilisateur
const generateFakeUser = async () => {
  const [firstName, lastName, domain] = await Promise.all([
    db
      .collection("firstNames")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray(),
    db
      .collection("lastNames")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray(),
    db
      .collection("domains")
      .aggregate([{ $sample: { size: 1 } }])
      .toArray(),
  ]);

  return {
    firstName: firstName[0].name,
    lastName: lastName[0].name,
    email: `${firstName[0].name.toLowerCase()}.${lastName[0].name.toLowerCase()}@${
      domain[0].domain
    }`,
    password: getRandomPassword(),
  };
};

// Route pour créer des faux utilisateurs (GET)
app.get("/api/fake-user", async (req, res) => {
  try {
    const fakeUser = await generateFakeUser();
    res.json(fakeUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour créer plusieurs faux utilisateurs (GET)
app.get("/api/fake-users", async (req, res) => {
  try {
    const count = Math.max(1, parseInt(req.query.count) || 1); // Nombre d'utilisateurs à générer
    const fakeUsers = await Promise.all(
      Array.from({ length: count }, generateFakeUser)
    );
    res.json(fakeUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`ApiFakeUser en cours d'exécution sur http://localhost:${port}`);
});
