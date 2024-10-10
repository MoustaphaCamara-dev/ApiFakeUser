// Connexion à MongoDB
const { MongoClient } = require("mongodb");

async function run() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    // Connexion au client
    await client.connect();
    const db = client.db("userDB"); // Créer ou accéder à la base de données

    // Créer des collections
    const firstNamesCollection = db.collection("firstNames");
    const lastNamesCollection = db.collection("lastNames");
    const domainsCollection = db.collection("domains");

    // Insertion des prénoms
    const firstNames = [
      { name: "John" },
      { name: "Jane" },
      { name: "Alice" },
      { name: "Bob" },
      { name: "Charlie" },
      { name: "Eve" },
    ];
    await firstNamesCollection.insertMany(firstNames);
    console.log("Prénoms insérés avec succès !");

    // Insertion des noms de famille
    const lastNames = [
      { name: "Doe" },
      { name: "Smith" },
      { name: "Johnson" },
      { name: "Brown" },
      { name: "Davis" },
      { name: "Wilson" },
    ];
    await lastNamesCollection.insertMany(lastNames);
    console.log("Noms de famille insérés avec succès !");

    // Insertion des noms de domaine
    const domains = [
      { domain: "example.com" },
      { domain: "test.com" },
      { domain: "demo.com" },
      { domain: "mail.com" },
    ];
    await domainsCollection.insertMany(domains);
    console.log("Noms de domaine insérés avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'insertion des données : ", error);
  } finally {
    await client.close(); // Fermer le client
  }
}

// Exécuter la fonction
run().catch(console.dir);
