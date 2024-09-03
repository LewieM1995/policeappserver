const pool = require('../../database'); // Adjust the path to your database module

const deletePantone = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the ID
    if (!id) {
      return res.status(400).json({ error: 'Pantone ID is required' });
    }

    // Prepare the SQL query to delete the Pantone entry
    const query = 'DELETE FROM pantones WHERE id = ?';

    // Execute the query with the provided ID
    const [result] = await pool.query(query, [id]);

    // Check if the deletion was successful
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Pantone deleted successfully' });
    } else {
      res.status(404).json({ error: 'Pantone not found' });
    }
  } catch (error) {
    console.error('Error deleting Pantone:', error);
    res.status(500).json({ error: 'Failed to delete Pantone' });
  }
};

module.exports = deletePantone;
