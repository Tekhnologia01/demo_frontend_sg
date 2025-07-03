export const formatEpochToDate = (epoch) => {
    // If epoch is in seconds, convert to milliseconds
    if (epoch.toString().length === 10) {
        epoch *= 1000;
    }

    const date = new Date(epoch);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

export const formatEpochToDateTime = (epoch) => {
    // If epoch is in seconds, convert to milliseconds
    if (epoch.toString().length === 10) {
        epoch *= 1000;
    }

    const date = new Date(epoch);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // You can set to false for 24-hour format
    };

    return date.toLocaleString(undefined, options);
};

export const formatEpochToLargestUnit = (epoch) => {
  // If epoch is in seconds, convert to milliseconds
  if (epoch?.toString()?.length === 10) {
    epoch *= 1000;
  }

  const now = Date.now();
  const diffInSeconds = Math.floor((now - epoch) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};



