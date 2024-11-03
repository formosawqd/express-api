module.exports = {
  filterBody: (req) => {
    const { title, content } = req.body;
    return {
      title,
      content,
    };
  },
};
