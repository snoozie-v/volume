function updateDates() {
  const now = new Date();
  console.log(now)


  // Calculate the start and end times for a 48-hour window
  const startDateTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 48 hours ago
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