exports.formatDates = (list) => {
  const formattedDates = list.map(({ created_at, ...otherKeys }) => {
    return { created_at: new Date(created_at), ...otherKeys };
  });
  return formattedDates;
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
