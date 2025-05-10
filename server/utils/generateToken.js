const jwt = require("jsonwebtoken");

// Function to generate a JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = generateToken;
