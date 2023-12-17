const pool = require('../database');
require('dotenv').config();

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}


exports.getDataTable = async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    try {

      const productSize = req.query.productSize;
      //console.log('Product Size:', productSize)

      const query = `
      SELECT
        s.submission_time,
        i.visual_inspection,
        i.seam_inspection,
        md.operator,
        md.line,
        md.shift,
        m.weight,
        m.height,
        m.minimum_wall_thickness,
        pd.check_type,
        pd.product_size,
        pd.cavity
      FROM
        submission s
        INNER JOIN inspection i ON s.submission_id = i.submission_id
        INNER JOIN machine_details md ON s.submission_id = md.submission_id
        INNER JOIN measurement m ON s.submission_id = m.submission_id
        INNER JOIN product_details pd ON s.submission_id = pd.submission_id
      WHERE 
        pd.product_size = '${productSize}';
    `;


      const [data] = await connection.execute(query);

      const result = data.map((row) => ({
        submission_time: formatDate(row.submission_time),
        weight: parseFloat(row.weight),
        height: parseFloat(row.height),
        minimum_wall_thickness: parseFloat(row.minimum_wall_thickness),
        visual_inspection: row.visual_inspection,
        seam_inspection: row.seam_inspection,
        shift: row.shift,
        operator: row.operator,
        line: row.line,
        product_size: row.product_size,
        cavity: row.cavity,
        check_type: row.check_type
      }));

      res.status(200).json(result);
        //console.log(result);
      } catch (error) {
        throw error 
      } finally {
        connection.release();
      }
  } catch (error) {
    console.error();
    res.status(500).json({error: 'Server Error'});
  }

};
