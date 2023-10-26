

function CountData (data) {
    const outcomeCounts = {};
    data.forEach((item) => {
        if (outcomeCounts[item]) {
            outcomeCounts[item]++;
        } else {
            outcomeCounts[item] = 1;
        }
    });

    const uniqueOutcome = [...new Set(data)];
    const outcomeWithCounts = uniqueOutcome.map((item) => ({
        outcome: item,
        count: outcomeCounts[item]
    }));

    return outcomeWithCounts
}

module.exports = CountData;