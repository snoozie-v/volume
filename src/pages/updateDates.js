function getStartOfMonthAgo() {
  const now = new Date();
  const startDateTime = new Date(now.getTime() - 720 * 60 * 60 * 1000); // 24 hours ago

  const endDateTime = now;

  return {
    startDateTime,
    endDateTime,
  };
}

function getStartOf24HoursAgo() {
  const now = new Date();
  const startDateTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
  const endDateTime = now;

  return {
    startDateTime,
    endDateTime,
  };
}

function getStartOfPrevious7Days() {
  const now = new Date();
  const startDateTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Previous 7 days
  const endDateTime = now;

  return {
    startDateTime,
    endDateTime,
  };
}

export { getStartOfMonthAgo, getStartOf24HoursAgo, getStartOfPrevious7Days };

  // Format start and end date/time strings
  // const startDateTimeString = startDateTime.toLocaleString('en-US', {
  //   year: '2-digit',
  //   month: '2-digit',
  //   day: '2-digit',
  // }) + ' ' + startDateTime.toLocaleTimeString('en-US', { timeZoneName: 'short' });
  
  // const endDateTimeString = endDateTime.toLocaleString('en-US', {
  //   year: '2-digit',
  //   month: '2-digit',
  //   day: '2-digit',
  // }) + ' ' + endDateTime.toLocaleTimeString('en-US', { timeZoneName: 'short' });


  
