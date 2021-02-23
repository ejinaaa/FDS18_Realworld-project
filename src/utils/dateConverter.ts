const dateConverter = (ISOdate: string) => {
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const createDate = new Date(ISOdate);
  return `${day[createDate.getDay()]} ${month[createDate.getMonth()]} ${createDate.getDate()} ${createDate.getFullYear()}`;
};

export default dateConverter;