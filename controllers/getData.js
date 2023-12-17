const { pool2 } = require('../database');
require('dotenv').config();

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

exports.getData = async (req, res) => {
   try {
    const connection = await pool2.promise().getConnection();
        try {
        
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 300);
    const formattedTwoWeeksAgo = twoWeeksAgo.toISOString().split('T')[0];
        
    const productSize = req.query.productSize;
    //console.log('Product Size:', productSize)
        
    const query = `
        SELECT s.submission_time, m.weight, m.height, m.minimum_wall_thickness
        FROM submission AS s
        INNER JOIN product_details AS pd ON s.submission_id = pd.submission_id
        INNER JOIN measurement AS m ON pd.submission_id = m.submission_id
        WHERE s.submission_time >= '${formattedTwoWeeksAgo}'
        AND pd.product_size = '${productSize}'
    `;
      

    const [data] = await connection.execute(query);
    console.log('Query Result:', data);
    console.log('Sample Row:', data[0]);



    const result = data.map((row) => ({
        submission_time: formatDate(row.submission_time),
        weight: parseFloat(row.weight),
        height: parseFloat(row.height),
        minimum_wall_thickness: parseFloat(row.minimum_wall_thickness),
    }));
    
        res.status(200).json(result);
            //console.log(result);
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
   } catch (error) {
        console.error();
        res.status(500).json({ error: 'Server Error'});
   }
};


/* const [data] = await connection.execute(`
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
               INNER JOIN inspection i ON s.id = i.submission_id
               INNER JOIN machine_details md ON s.id = md.submission_id
               INNER JOIN measurement m ON s.id = m.submission_id
               INNER JOIN product_details pd ON s.id = pd.submission_id
         `)

        const result = data.map((row) => ({
            submission_time: row.submission_time,
            visual_inspection: row.visual_inspection,
            seam_inspection: row.seam_inspection,
            shift: row.shift,
            operator: row.operator,
            line: row.line,
            weight: row.weight,
            height: row.height,
            minimum_wall_thickness: row.minimum_wall_thickness,
            check_type: row.check_type,
            product_size: row.product_size,
            cavity: row.cavity
        })); */