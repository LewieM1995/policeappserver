const bcrypt = require('bcrypt');
const pool = require('../../../database'); // Adjust the path to your database configuration

const addUser = async (username, password) => {
  try {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)';
    const values = [username, hashedPassword, 1];
    await pool.query(query, values);

    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

// Example usage
addUser('AdminAcc', 'isadminyes1', 1);
