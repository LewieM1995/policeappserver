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
        //console.log(req.body.coordinates)
        const { userLat = [], userLng = [] } = req.body.coordinates;
        const nonEmptyCoords = userLat.reduce((acc, lat, index) => {
          const lng = userLng[index];
          if (lat.trim() !== '' && lng.trim() !== '') {
            acc.push(`${lat.trim()},${lng.trim()}`);
          }
          return acc;
        }, []);
      
        if (nonEmptyCoords.length === 1) {
          const [singleLat, singleLng] = nonEmptyCoords[0].split(',');
          apiUrl = `https://data.police.uk/api/stops-street?lat=${singleLat}&lng=${singleLng}&date=${date}`;
        } else if (nonEmptyCoords.length > 1) {
          poly = nonEmptyCoords.join(":");
          apiUrl = `https://data.police.uk/api/stops-street?poly=${poly}&date=${date}`;
        }
      }
      //console.log(apiUrl)
  
      const apiResponsePoly = await fetch(apiUrl);
  
      if (!apiResponsePoly.ok) {
        throw new Error('API request failed');
      }
  
      const parsedData = await apiResponsePoly.json();
  
      //perform further data processing here if necessary
      const dataSummary = parsedData.reduce(
        (summary, item) => {
          // Count gender occurrences
          summary.males += item.gender === 'Male' ? 1 : 0;
          summary.females += item.gender === 'Female' ? 1 : 0;
  
          // Collect object_of_search and outcome
          summary.searchObject.push(item.object_of_search);
          summary.outcome.push(item.outcome);
  
          // Collect officer_defined_ethnicity
          summary.ethnicity.push(item.officer_defined_ethnicity);
  
          return summary;
        },
        {
          males: 0,
          females: 0,
          searchObject: [],
          outcome: [],
          ethnicity: [],
        }
      );
  
      // Count occurrences for each collected data
      const searchObjectCount = CountData(dataSummary.searchObject);
      const outcomeWithCounts = CountData(dataSummary.outcome);
      const ethnicityCount = CountData(dataSummary.ethnicity);

      const clientData = {
        males: dataSummary.males,
        females: dataSummary.females,
        date,
        searchObjectCount,
        outcomeWithCounts,
        ethnicityCount,
      };
  
      res.setHeader('Content-Type', 'application/json');
      res.json(clientData);
      //console.log(clientData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  
