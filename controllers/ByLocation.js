const CountData = require("./CountData");

exports.ByLocation = async (req, res) => {
    try {
      
      let date = req.body.date || '2023-11';
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentDate = `${currentYear}-${(currentMonth + 1) .toString().padStart(2, '0')}`;
      //console.log("req.body.date", req.body.date);
      //console.log("currentDate", currentDate);
      if (req.body.date === currentDate) {
          // Setting date to the previous month and year if current date is january
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          date = `${lastYear}-${lastMonth.toString().padStart(2, '0')}`;
          //console.log("update date:", date);
      };


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
          // Count genders
          summary.males = summary.males + (item.gender === 'Male' ? 1 : 0);
          summary.females = summary.females + (item.gender === 'Female' ? 1 : 0);
  
          // Collect other obejcts. Perform count below
          summary.searchObject.push(item.object_of_search);
          summary.outcome.push(item.outcome);
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

  
