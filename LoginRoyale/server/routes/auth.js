const express = require("express");
const router = express.Router();
const { generatePassword } = require("../utils/generatePassword");

// NOTE: this is a fake auth layer for demo.
// You can swap in a real DB & hashing later.

function simulateDelay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fake login (for now accepts any non-empty email + password)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await simulateDelay(700 + Math.random() * 600);
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing credentials" });
  }
  // For demo, pretend success and return a fake user object and token
  const token = "fake-jwt-token-" + Math.random().toString(36).slice(2, 10);
  res.json({ success: true, user: { email }, token });
});

// Reset password (only allowed after Blackjack win client-side)
router.post("/reset", async (req, res) => {
  await simulateDelay(700);
  // Generate a new password (for demo). In production, you'd email or set securely.
  const newPassword = generatePassword();
  res.json({ success: true, newPassword });
});

// Verify (horse race) endpoint — server doesn't determine winner in this demo
router.post("/verify", async (req, res) => {
  await simulateDelay(400);
  // client supplies chosenHorse and actualWinner; server verifies if they'd be used
  const { chosen, winner } = req.body || {};
  const ok = chosen && winner && chosen === winner;
  res.json({ success: ok, message: ok ? "Correct" : "Incorrect" });
});

// 2FA endpoint — client returns dice results, server validates (for demo)
router.post("/2fa", async (req, res) => {
  await simulateDelay(300);
  const { die1, die2 } = req.body || {};
  const doubles = die1 && die2 && die1 === die2;
  res.json({
    success: doubles,
    message: doubles ? "2FA success" : "Not doubles",
  });
});

module.exports = router;
