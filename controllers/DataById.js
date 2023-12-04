

const pool = require('../database');

exports.GetDataById = async (req, res) => {
 try {

  const {id} = req.params;

  //console.log(req.params);

  const connection = pool.promise();

  const query = 'SELECT * FROM `stops` WHERE `id` = ? ';
  const values = [id];
  const [result] = await connection.execute(query, values);

  if (result && result.length > 0){
    const object= result[0];
    res.setHeader('Content-Type', 'application/json');
    res.json(object);
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
  }
};