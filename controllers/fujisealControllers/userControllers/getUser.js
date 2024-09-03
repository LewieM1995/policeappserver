const bcrypt = require('bcrypt');
const {pool3} = require('../../../database');

const getUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body)

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Query to find the user by username
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = pool3.query(query, [username]);

    if (rows.length > 0) {
      const user = rows[0];

      // Compare the provided password with the hashed password in the database
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Passwords match
        const responseData = {
          username: user.username,
          isAdmin: user.isAdmin ? true : false
        };
        console.log(responseData)
        return res.json({ authenticated: true, responseData });
      } else {
        return res.status(401).json({ error: "Invalid username or password" });
      }
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {getUser};
