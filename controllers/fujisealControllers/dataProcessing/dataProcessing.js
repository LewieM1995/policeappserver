const parseDE = (de) => parseFloat(de);

const prepareAniloxScatterData = (data) => {
  // Convert date strings to Date objects if necessary and format
  const preparedData = data.map((item) => {
    const dateObj = new Date(item.date); // Ensure item.date is a valid date string or Date object
    const formattedDate = dateObj.toLocaleDateString("en-GB"); // Format to DD/MM/YYYY

    return {
      anilox: item.anilox,
      de: parseFloat(item.de),
      date: formattedDate, // Store formatted date
      rawDate: dateObj, // Store the raw Date object for sorting
    };
  });

  // Sort by rawDate
  preparedData.sort((a, b) => a.rawDate - b.rawDate);

  // Calculate the trend line
  const n = preparedData.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;

  preparedData.forEach((item, index) => {
    const x = index; // Use index as x-value
    const y = item.de;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Add trend line values to the prepared data
  preparedData.forEach((item, index) => {
    item.trendline = slope * index + intercept;
  });

  return preparedData;
};

const calculateSAPPercentage = (data) => {
  // Total number of items
  const totalItems = data.length;

  // Count the number of items where SAP is 1 (true)
  const sapYesCount = data.filter((item) => item.SAP === 1).length;

  // Calculate the percentage
  const percentage = (sapYesCount / totalItems) * 100;

  // Return the percentage rounded to 2 decimal places
  return parseFloat(percentage.toFixed(2));
};

const calculateAniloxPerformance = (data) => {
    // Group data by 'anilox' property
    const groupedByAnilox = data.reduce((acc, item) => {
      if (!acc[item.anilox]) {
        acc[item.anilox] = [];
      }
      acc[item.anilox].push(item);
      return acc;
    }, {});
  
    // Calculate performance for each anilox type
    return Object.entries(groupedByAnilox).map(([anilox, items]) => {
      // Filter items with 'de' values less than or equal to 3
      const validItems = items.filter((item) => parseDE(item.de) <= 3);
  
      // Calculate average 'de'
      const avgDE =
        validItems.length > 0
          ? parseFloat(
              (
                validItems.reduce((sum, item) => sum + parseDE(item.de), 0) /
                validItems.length
              ).toFixed(2)
            )
          : null;
      
      // Define an upper limit (example value)
      const upperlimit = 2;
  
      return {
        anilox,
        avgDE,
        upperlimit,
      };
    });
  };

const calculatePantoneTargetingAccuracy = (data) => {
    const pantoneColors = data.filter((item) =>
        item.colour_value && item.colour_type === "pantone"
      );
    
      // Filter for correctly targeted pantone colors
      const correctlyTargeted = pantoneColors.filter(
        (item) => item.target.toLowerCase() === "pantone"
      );
  return (correctlyTargeted.length / pantoneColors.length) * 100;
};

const calculateMasterTargetingAccuracy = (data) => {
  const masterColors = data.filter((item) => item.colour_type === "master");
  const correctlyTargeted = masterColors.filter(
    (item) => item.target.toLowerCase() === "master"
  );
  return (correctlyTargeted.length / masterColors.length) * 100;
};

const calculateLABTargetingAccuracy = (data) => {
  const labColors = data.filter((item) => item.colour_type === "lab");
  const correctlyTargeted = labColors.filter((item) => item.target.toLowerCase() === "lab");
  return (correctlyTargeted.length / labColors.length) * 100;
};

const calculateRightFirstTime = (data, threshold = 2) => {
  const totalJobs = data.length;
  const jobsUnderThreshold = data.filter(
    (item) => parseDE(item.de) < threshold
  ).length;
  return (jobsUnderThreshold / totalJobs) * 100;
};

const prepareDEOverTimeData = (data) => {
  const validData = data.filter(
    (item) => item && item.date && item.de && parseDE(item.de) <= 2.5
  );

  // Group data by date
  const groupedByDate = validData.reduce((acc, item) => {
    // Use the Date object directly
    const datePart = item.date.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    if (!acc[datePart]) {
      acc[datePart] = [];
    }
    acc[datePart].push(item);
    return acc;
  }, {});

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); // Calculate the date 6 months ago

  return Object.entries(groupedByDate)
    .map(([date, items]) => {
      const parsedDate = new Date(date);
      return {
        date: parsedDate,
        displayDate: parsedDate.toLocaleDateString('en-GB'), // Format as 'DD-MM-YYYY'
        de: parseFloat(
          (
            items.reduce((sum, item) => sum + parseDE(item.de), 0) / items.length
          ).toFixed(2)
        ),
      };
    })
    .filter((item) => item.date >= sixMonthsAgo) // Filter data to only include the last 6 months
    .sort((a, b) => a.date - b.date)
    .map((item) => ({
      date: item.displayDate,
      de: item.de,
      target: 2,
    }));
};

  

module.exports = {
  prepareAniloxScatterData,
  calculateSAPPercentage,
  calculateAniloxPerformance,
  calculatePantoneTargetingAccuracy,
  calculateMasterTargetingAccuracy,
  calculateLABTargetingAccuracy,
  calculateRightFirstTime,
  prepareDEOverTimeData,
};
