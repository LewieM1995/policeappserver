const pool = require('../../database');

const postData = async (req, res) => {
  try {
    const { PPONum, designNum, speNum, colors, sunAttendPress } = req.body;
    console.log(req.body);

    if (!PPONum || !designNum || !speNum || !colors || !Array.isArray(colors) || sunAttendPress === null) {
      return res.status(400).json({ error: "Fill out required fields" });
    }

    // Server-side generated date
    const createdAt = new Date();
    console.log('created At', createdAt)

    // Insert job data
    const mainInsertQuery = `
      INSERT INTO job_table (PPONum, designNum, speNum, createdAt)
      VALUES (?, ?, ?, ?)
    `;

    const mainInsertValues = [PPONum, designNum, speNum, createdAt];
    
    const client = await pool.getConnection();

    try {
      await client.beginTransaction();

      await client.query(mainInsertQuery, mainInsertValues);

      // Get the last inserted ID
      const [result] = await client.query('SELECT LAST_INSERT_ID() as id');
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
        await client.query(colorInsertQuery, colorInsertValues);
      }

      
      await client.commit();
      res.json({ success: true, message: "Data inserted successfully" });
    } catch (error) {
      await client.rollback();
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal Server Error: postData.js" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error: postData.js" });
  }
};

module.exports = postData;
