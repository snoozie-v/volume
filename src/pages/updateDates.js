function updateDates() {
    const now = new Date();
    const pacificTimeZoneOffset = -7; // PST is UTC-8, but considering daylight saving time
    now.setHours(8 + pacificTimeZoneOffset, 0, 0, 0); // Set to 8:00:00.000 AM PST
    
    const startDateTimeString = now.toLocaleString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    }) + ' 12:00 AM PST';
    console.log(startDateTimeString)
    now.setHours(8 + 24 + pacificTimeZoneOffset, -1, -1, -1); // Set to 7:59:59.999 PM PST
    const endDateTimeString = now.toLocaleString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    }) + ' 11:59 PM PST';
  
    const startTimeStamp = Date.parse(startDateTimeString) / 1000
    const endTimeStamp = Date.parse(endDateTimeString) / 1000;
  
    console.log(startTimeStamp, endTimeStamp)
  
    console.log("Start Date/Time:", startDateTimeString);
    console.log("End Date/Time:", endDateTimeString);
    console.log("Start Timestamp:", startTimeStamp);
    console.log("End Timestamp:", endTimeStamp);

    return {
        startTimeStamp,
        endTimeStamp,
        startDateTimeString,
        endDateTimeString
    }
  }
  
  // Set up an interval to update the dates every day at 8 AM PST
  const intervalInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours
  setInterval(updateDates, intervalInMilliseconds);

  export default updateDates;