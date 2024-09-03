const { pool3 } = require('../../database'); // Adjust the path to your database module

const updatePantone = async (req, res) => {
  let connection;
  try {
    const { id, label, value, type, hex, r, g, b } = req.body;

    console.log(req.body);

    // Validate the provided data
    if (id && label && value && type) {
      // Prepare the SQL query to update the Pantone entry
      const query = `
        UPDATE pantones
        SET label = ?, value = ?, type = ?, hex = ?, r = ?, g = ?, b = ?
        WHERE id = ?
      `;

      // Get a database connection from the pool3
      connection = await pool3.promise().getConnection();

      // Execute the query with the provided data
      const [result] = await connection.query(query, [label, value, type, hex, r, g, b, id]);

      // Check if the update was successful
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Pantone updated successfully' });
      } else {
        res.status(404).json({ error: 'Pantone not found' });
      }
    } else {
      res.status(400).json({ error: 'Invalid data' });
    }
  } catch (error) {
    console.error('Error updating Pantone:', error);
    res.status(500).json({ error: 'Failed to update Pantone' });
  } finally {
    // Ensure the connection is released back to the pool3
    if (connection) {
      connection.release();
    }
  }
};

module.exports = updatePantone;
