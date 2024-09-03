const pool = require('../../database'); // Adjust the path to your database module

const updatePantone = async (req, res) => {
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

      // Execute the query with the provided data
      const [result] = await pool.query(query, [label, value, type, hex, r, g, b, id]);

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
  }
};

module.exports = updatePantone;
