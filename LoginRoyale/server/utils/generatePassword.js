// playful, human-like password generator
function generatePassword() {
  const words = [
    "royale",
    "spin",
    "ace",
    "lucky",
    "vault",
    "neon",
    "ember",
    "orbit",
    "delta",
  ];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const a = pick(words);
  const b = Math.floor(100 + Math.random() * 900);
  const c = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${a}-${b}${c}`;
}

module.exports = { generatePassword };
