const { pool3 } = require("../../database");
const {
  prepareAniloxScatterData,
  calculateSAPPercentage,
  calculateAniloxPerformance,
  calculatePantoneTargetingAccuracy,
  calculateMasterTargetingAccuracy,
  calculateLABTargetingAccuracy,
  calculateRightFirstTime,
  prepareDEOverTimeData,
} = require("../fujisealControllers/dataProcessing/dataProcessing");

const getChart = async (req, res) => {
  try {
    const { chartType } = req.body;

    if (!chartType) {
      return res.status(400).json({ error: "No chart type given." });
    }

    // Use promise-based query method
    const [rows] = await pool3.promise().query("SELECT * FROM colour_data");

    const data = rows;
    let chartData;

    switch (chartType) {
      case "aniloxPerformance":
        chartData = calculateAniloxPerformance(data);
        break;
      case "deOverTime":
        chartData = prepareDEOverTimeData(data);
        break;
      case "rightFirstTime":
        chartData = calculateRightFirstTime(data);
        break;
      case "pantoneTargeting":
        chartData = calculatePantoneTargetingAccuracy(data);
        break;
      case "labTargeting":
        chartData = calculateLABTargetingAccuracy(data);
        break;
      case "masterTargeting":
        chartData = calculateMasterTargetingAccuracy(data);
        break;
      case "sunAttendPress":
        chartData = calculateSAPPercentage(data);
        break;
      case "aniloxScatter":
        chartData = prepareAniloxScatterData(data);
        break;
      default:
        chartData = calculateAniloxPerformance(data);
        break;
    }

    return res.json({ chartData });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getChart;
