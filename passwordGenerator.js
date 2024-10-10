// passwordGenerator.js

const getRandomPassword = () => {
  const length = 8; // Longueur du mot de passe
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz"; // Lettres minuscules
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Lettres majuscules
  const numbers = "0123456789"; // Chiffres
  const specialChars = "!@#$%^&*()"; // Caractères spéciaux

  // On s'assure que le mot de passe contient au moins une lettre minuscule, une majuscule, un chiffre et un caractère spécial
  const passwordArray = [
    lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length)),
    upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length)),
    numbers.charAt(Math.floor(Math.random() * numbers.length)),
    specialChars.charAt(Math.floor(Math.random() * specialChars.length)),
  ];

  // Remplissage du reste du mot de passe avec des caractères aléatoires
  const allChars = lowerCaseChars + upperCaseChars + numbers + specialChars;

  for (let i = 4; i < length; i++) {
    passwordArray.push(
      allChars.charAt(Math.floor(Math.random() * allChars.length))
    );
  }

  // Mélanger le mot de passe pour éviter une disposition prévisible
  const password = passwordArray.sort(() => Math.random() - 0.5).join("");

  // Vérifier que le mot de passe contient les exigences
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;

  // Si le mot de passe ne correspond pas au modèle, on génère un nouveau mot de passe
  return passwordPattern.test(password) ? password : getRandomPassword();
};

module.exports = getRandomPassword; // Exporter la fonction
