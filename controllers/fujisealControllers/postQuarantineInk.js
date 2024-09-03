const pool = require("../../database"); // Replace with your actual database connection module

const postQuarantineInks = async (req, res) => {
  try {
    const { formState } = req.body;
    console.log(req.body);

    // Input validation
    const requiredFields = ['technician', 'design', 'weight', 'ppo', 'reason'];
    if (Object.keys(formState).length !== 5 || !requiredFields.every(field => formState[field])) {
      return res.status(400).json({ error: "Fill out required fields" });
    }

    // Server-side generated date
    const createdAt = new Date();
    console.log("created At", createdAt);

    // Main insert query
    const mainInsertQuery = `
      INSERT INTO quarantine_table (technician, design, weight, ppo, reason, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const mainInsertValues = [
      formState.technician,
      formState.design,
      formState.weight,
      formState.ppo,
      formState.reason,
      createdAt,
    ];

    // Get a database connection from the pool
    const client = await pool.getConnection();

    try {
      // Begin transaction
      await client.beginTransaction();

      // Insert main data
      await client.query(mainInsertQuery, mainInsertValues);

      // Commit transaction
      await client.commit();
      res.json({ success: true, message: "Data inserted successfully" });
    } catch (error) {
      // Rollback transaction in case of error
      await client.rollback();
      console.error("Error inserting data:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error: postQuarantineInks.js" });
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error: postQuarantineInks.js" });
  }
};

module.exports = postQuarantineInks;
