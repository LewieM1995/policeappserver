const crypto = require('crypto');
const {pool1} = require('../database');

function hashString(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

exports.ByForce = async (req, res) => {
 try {
    
  let date = req.body.date || '2023-09';
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
    if (date === currentDate) {
      // Setting date to the previous month and year if current date is january (currently an issue with 2023-12 on police api end setting to nov instead)
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      date = `${lastYear}-${(lastMonth).toString().padStart(2, "0")}`;
    }
  
  const forcename = req.body.dropdownvalue;

  let apiUrl = `https://data.police.uk/api/stops-force?force=${forcename}&date=${date}`;
        
  const apiResponsePoly = await fetch(apiUrl);
  
  if (!apiResponsePoly.ok) {
    throw new Error('API request failed');
  }
  
  const parsedData = await apiResponsePoly.json();
  //console.log('API Response:', parsedData);
  
  //perform further data processing here if necessary
    
  let dataWithIds = [];
  parsedData.forEach((item, index) => {
    //console.log('Processing item:', item);
    if (item && item.location && item.datetime){
    const uniqueId = `${index++}}_${item.datetime}_${item.object_of_search}_${item.location.street.id}_${item.outcome}_${item.legislation}_${forcename}`;
    const hashedId = hashString(uniqueId);
    
    const itemWithId = { id: hashedId, ...item };
    dataWithIds.push(itemWithId);
    }
  });

  //console.log('Data with IDs:', dataWithIds);

  const connection = pool1.promise();

  const query = 'SELECT * FROM `stops` WHERE `forcename` = ? AND `date` = ?';
  const values = [forcename, date];
  const existingData = await connection.execute(query, values);

  if (existingData[0].length > 0) {
    console.log('Data found. Retrieving from cache');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(existingData[0]);
    return;
}


  const insertQuery = 'INSERT INTO stops (id, age_range, self_defined_ethnicity, outcome_linked_to_object_of_search, datetime, removal_of_more_than_outer_clothing, operation, officer_defined_ethnicity, object_of_search, involved_person, gender, legislation, location_latitude, location_street_id, location_street_name, location_longitude, outcome, type, operation_name, forcename, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  for (const item of dataWithIds) {
    const insertValues = [
      item.id,
      item.age_range,
      item.self_defined_ethnicity,
      item.outcome_linked_to_object_of_search,
      item.datetime,
      item.removal_of_more_than_outer_clothing,
      item.operation,
      item.officer_defined_ethnicity,
      item.object_of_search,
      item.involved_person,
      item.gender,
      item.legislation,
      item.location.latitude,
      item.location.street.id,
      item.location.street.name,
      item.location.longitude,
      item.outcome,
      item.type,
      item.operation_name,
      forcename,
      date
    ];

    await connection.execute(insertQuery, insertValues);
}

    //await connection.end();
    //const test = testUniqueIds(dataWithIds);
    console.log('New data inserted. Returning updated data.');
    res.setHeader('Content-Type', 'application/json');
    res.json(dataWithIds);
    }catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
