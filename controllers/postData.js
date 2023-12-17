const {pool2} = require('../database');
require('dotenv').config();

exports.postData = async (req, res) => {
  try {
    const {
      shifts,
      operator,
      line,
      check_type,
      product_size,
      cavity,
      visual_inspection,
      seam_inspection,
      weight,
      height,
      minimum_wall_thickness
    } = req.body;

    console.log("Received Data", req.body);

    const connection = await pool2.promise().getConnection();
    //console.log(connection);

    try {
      await connection.beginTransaction();

      const submissionTime = new Date();

      const [submitResult] = await connection.execute('INSERT INTO submission (submission_time) VALUES (?)', [submissionTime]);
      const submissionId = submitResult.insertId;

      await connection.execute('INSERT INTO inspection (visual_inspection, seam_inspection, submission_id) VALUES (?, ?, ?)', [
        visual_inspection.value,
        seam_inspection.value,
        submissionId
      ]);
      await connection.execute('INSERT INTO machine_details (shift, operator, line, submission_id) VALUES (?, ?, ?, ?)', [
        shifts.value,
        operator.value,
        line.value,
        submissionId
      ]);
      await connection.execute('INSERT INTO measurement (weight, height, minimum_wall_thickness, submission_id) VALUES (?, ?, ?, ?)', [
        weight,
        height,
        minimum_wall_thickness,
        submissionId
      ]);
      await connection.execute('INSERT INTO product_details (check_type, product_size, cavity, submission_id) VALUES (?, ?, ?, ?)', [
        check_type.value,
        product_size.value,
        cavity.value,
        submissionId
      ]);

      await connection.commit();

      res.status(201).json({ message: 'Data Saved to SQL' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};