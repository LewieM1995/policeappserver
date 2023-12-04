function testUniqueIds(data) {
    const idCountMap = new Map();
  
    for (const item of data) {
      const id = item.id;
  
      if (idCountMap.has(id)) {
        idCountMap.set(id, idCountMap.get(id) + 1);
      } else {
        idCountMap.set(id, 1);
      }
    }
  
    const nonUniqueIds = Array.from(idCountMap.entries())
      .filter(([count]) => count > 1)
      .map(([id]) => id);
  
    if (nonUniqueIds.length > 0) {
      console.log(`Number of repeated IDs: ${nonUniqueIds.length}`);
      console.log('Repeated IDs:', nonUniqueIds);
      return false;
    }
  
    console.log('All IDs are unique.');
    return true;
  }

  module.exports = testUniqueIds;