exports.generateAllPaths = () => {
  return {
    endpoints: [
      { path: "/api", methods: ["GET"] },
      { path: "/api/topics", methods: ["GET"] },
      { path: "/api/users/:username", methods: ["GET"] },
      { path: "/api/articles", methods: ["GET"] },
      { path: "/api/articles/:article_id", methods: ["GET", "PATCH"] },
      { path: "/api/articles/:article_id/comments", methods: ["GET", "POST"] },
      { path: "/api/comments/:comment_id", methods: ["PATCH", "DELETE"] },
    ],
  };
};
