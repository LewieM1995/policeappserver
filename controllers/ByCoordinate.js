
exports.ByCoordinate = async (req, res) => {
    try {
        
      console.log('Request Body Coordinates:', req.body.coordinates);
      const {userLat, userLng} = req.body.coordinates;
      const date = '2023-05';

      const poly = userLat.map((latV, index) => `${latV},${userLng[index]}`).join(':');
        
      const apiUrl = `https://data.police.uk/api/stops-street?poly=${poly}&date=${date}`;

      console.log(apiUrl);
  
      const apiResponsePoly = await fetch(apiUrl);
  
      if (!apiResponsePoly.ok) {
        throw new Error('API request failed');
      }
  
      const parsedData = await apiResponsePoly.json();
  
      //perform further data processing here if necessary

      const males = parsedData.filter((v) => v.gender === 'Male').length;
      const females = parsedData.filter((v) => v.gender === 'Female').length;
      const street = parsedData.map((item) => item.location.street.name);
      const uniqueStreet = [...new Set(street)];
      const searchObject = parsedData.map((v) => v.object_of_search);
      const uniqueSearchObj = [...new Set(searchObject)];

      const outcome = parsedData.map((item) => item.outcome);
      const outcomeCounts = {};
      outcome.forEach((item) => {
        if (outcomeCounts[item]){
          outcomeCounts[item]++
        } else {
          outcomeCounts[item] = 1
        }
      });
      const uniqueOutcome = [...new Set(outcome)];
      const outcomeWithCounts = uniqueOutcome.map((item) => ({
        outcome: item,
        count: outcomeCounts[item]
      }));

      const clientData = {
        males, 
        females,
        date,
        uniqueStreet,
        uniqueSearchObj,
        outcomeWithCounts
      };
  
      res.setHeader('Content-Type', 'application/json');
      res.json(clientData);
     //console.log(clientData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};