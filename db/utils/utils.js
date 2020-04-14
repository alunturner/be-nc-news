exports.formatDates = (list) => {
  return list.map(({ created_at, ...otherKeys }) => {
    return { created_at: new Date(created_at), ...otherKeys };
  });
};

exports.makeRefObj = (list) => {
  const referenceObject = {};
  list.forEach(({ article_id, title }) => {
    referenceObject[title] = article_id;
  });
  return referenceObject;
};

exports.formatComments = (comments, lookup) => {
  return comments.map(
    ({ created_by, belongs_to, created_at, ...otherKeys }) => {
      return {
        author: created_by,
        article_id: lookup[belongs_to],
        created_at: new Date(created_at),
        ...otherKeys,
      };
    }
  );
};
