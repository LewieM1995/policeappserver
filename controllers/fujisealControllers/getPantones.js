const pool = require('../../database'); // Adjust the path to your database module

const getPantones = async (req, res) => {
  try {
    // Query to get all Pantones
    const [rows] = await pool.query('SELECT * FROM pantones');

    // Send the result as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching Pantones:', error);
    res.status(500).json({ error: 'Failed to fetch Pantones' });
  }
};

module.exports = getPantones;
