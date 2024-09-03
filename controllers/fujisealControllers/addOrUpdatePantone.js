const { pool3 } = require('../../database'); // Adjust the path to your database module

const addPantone = async (req, res) => {
  try {
    const { label, value, type, hex, r, g, b } = req.body;

    console.log(req.body);

    // Validate the provided data
    if (label && value && type) {
      // Check for duplicate Pantones
      const [duplicates] = await pool3.promise().query(
        'SELECT * FROM pantones WHERE value = ? OR label = ?',
        [value, label]
      );

      if (duplicates.length > 0) {
        return res.status(400).json({ error: 'Pantone with the same value or label already exists' });
      }

      // Prepare the SQL query to insert the new Pantone entry
      const query = `
        INSERT INTO pantones (label, value, type, hex, r, g, b)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query with the provided data
      const [result] = await pool3.promise().query(query, [label, value, type, hex, r, g, b]);

      // Check if the insertion was successful
      if (result.affectedRows > 0) {
        res.status(201).json({ message: 'New Pantone added successfully' });
      } else {
        res.status(500).json({ error: 'Failed to add new Pantone' });
      }
    } else {
      res.status(400).json({ error: 'Invalid Pantone data' });
    }
  } catch (error) {
    console.error('Error adding new Pantone:', error);
    res.status(500).json({ error: 'Failed to add new Pantone' });
  }
};

module.exports = addPantone;
