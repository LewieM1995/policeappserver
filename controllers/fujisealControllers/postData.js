const { pool3 } = require('../../database');

const postData = async (req, res) => {
  let connection;
  try {
    const { PPONum, designNum, speNum, colors, sunAttendPress } = req.body;
    console.log(req.body);

    if (!PPONum || !designNum || !speNum || !colors || !Array.isArray(colors) || sunAttendPress === null) {
      return res.status(400).json({ error: "Fill out required fields" });
    }

    // Server-side generated date
    const createdAt = new Date();
    console.log('created At', createdAt);

    // Get a connection from the pool
    connection = await pool3.promise().getConnection();

    try {
      await connection.beginTransaction();

      // Insert job data
      const mainInsertQuery = `
        INSERT INTO job_table (PPONum, designNum, speNum, createdAt)
        VALUES (?, ?, ?, ?)
      `;
      const mainInsertValues = [PPONum, designNum, speNum, createdAt];
      await connection.query(mainInsertQuery, mainInsertValues);

      // Get the last inserted ID
      const [result] = await connection.query('SELECT LAST_INSERT_ID() as id');
      const mainId = result[0].id;

      // Insert colors data
      const colorInsertQuery = `
        INSERT INTO colour_data (job_id, colour_value, colour_type, anilox, de, target, date, SAP)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      for (const color of colors) {
        const colorInsertValues = [
          mainId,
          color.selectedColor,
          color.selectedColorType,
          color.anilox,
          color.DE,
          color.target.toLowerCase(),
          createdAt,
          sunAttendPress
        ];
        await connection.query(colorInsertQuery, colorInsertValues);
      }

      await connection.commit();
      res.json({ success: true, message: "Data inserted successfully" });
    } catch (error) {
      await connection.rollback();
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal Server Error: postData.js" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Error rolling back transaction:", rollbackError);
      } finally {
        if (connection) {
          connection.release();
        }
      }
    } else {
      console.error("No connection available for rollback");
    }
    res.status(500).json({ error: "Internal Server Error: postData.js" });
  }
};

module.exports = postData;
