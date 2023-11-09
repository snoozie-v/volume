function updateDates() {
  const now = new Date();
  console.log(now)

  const mountainTimeOffset = 7 * 60 * 60 * 1000; // Mountain Standard Time (MST) offset

  // Set the date to the beginning of November in the Mountain Time Zone
  const startDateTime = new Date(Date.UTC(now.getUTCFullYear(), 10, 1, 0, 0, 0) + mountainTimeOffset);
  
  console.log(startDateTime);
  // Calculate the start and end times for a 48-hour window
  // const startDateTime = new Date(now.getTime() - 192 * 60 * 60 * 1000);  // 24 hours ago 
  console.log("start date time", typeof startDateTime)
  const endDateTime = now;
  console.log(endDateTime)

  // Format start and end date/time strings
  const startDateTimeString = startDateTime.toLocaleString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }) + ' ' + startDateTime.toLocaleTimeString('en-US', { timeZoneName: 'short' });
  
  const endDateTimeString = endDateTime.toLocaleString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }) + ' ' + endDateTime.toLocaleTimeString('en-US', { timeZoneName: 'short' });

  console.log("startDateTimeString and endDateTimeString", startDateTimeString, endDateTimeString)
  const startTimeStamp = Math.floor(startDateTime.getTime() / 1000);
  const endTimeStamp = Math.floor(endDateTime.getTime()/ 1000);
  console.log("startTimeStamp + endTimeStamp", startTimeStamp, endTimeStamp)

  return {
    startTimeStamp,
    endTimeStamp,
    startDateTimeString,
    endDateTimeString
  };
}

  export default updateDates;