const CountData = require("./CountData");

exports.ByLocation = async (req, res) => {
    try {
 
      
      let date = req.body.date
      if (!req.body.date){
       date = '2023-05'
      } 

      let poly;
      let apiUrl;

      if (req.body.city) {
        const { lat = [], lng = [] } = req.body.city;
        poly = lat.map((latV, index) => `${latV},${lng[index]}`).join(':');
        apiUrl = `https://data.police.uk/api/stops-street?poly=${poly}&date=${date}`;
      } else if (req.body.coordinates) {
        const { userLat = [], userLng = [] } = req.body.coordinates;
        const minArrayLength = Math.min(userLat.length, userLng.length);
        const pairedCoords = [];

        for (let i = 0; i < minArrayLength; i++){
          if (userLat[i] !== "" && userLng[i] !== ""){
            pairedCoords.push(`${userLat[i]},${userLng[i]}`);
          }
        }
        if (pairedCoords.length === 1){
          const [singleLat, singleLng] = pairedCoords[0].split(',');
          apiUrl = `https://data.police.uk/api/stops-street?lat=${singleLat}&lng=${singleLng}&date=${date}`;
        } else {
          poly = pairedCoords.join(":");
          apiUrl = `https://data.police.uk/api/stops-street?poly=${poly}&date=${date}`;
        }
      }
     
  
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
      //const uniqueSearchObj = [...new Set(searchObject)];
      const outcome = parsedData.map((item) => item.outcome);
      const outcomeWithCounts = CountData(outcome);

      const searchObjectCount = CountData(searchObject);
      console.log("objectCount:", searchObjectCount)
      console.log("outcomeCount:", outcomeWithCounts)

      const clientData = {
        males, 
        females,
        date,
        uniqueStreet,
        searchObjectCount,
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

  
