exports.generateAllPaths = () => {
  return {
    endpoints: [
      {
        path: "/api",
        method: { GET: { description: "", query: "", response: "" } },
      },
      {
        path: "/api/topics",
        method: { GET: { description: "", query: "", response: "" } },
      },
      {
        path: "/api/users/:username",
        method: { GET: { description: "", query: "", response: "" } },
      },
      {
        path: "/api/articles",
        method: { GET: { description: "", query: "", response: "" } },
      },
      {
        path: "/api/articles/:article_id",
        method: {
          GET: { description: "", query: "", response: "" },
          PATCH: { description: "", query: "", response: "" },
        },
      },
      {
        path: "/api/articles/:article_id/comments",
        method: {
          GET: { description: "", query: "", response: "" },
          POST: { description: "", query: "", response: "" },
        },
      },
      {
        path: "/api/comments/:comment_id",
        method: {
          PATCH: { description: "", query: "", response: "" },
          DELETE: { description: "", query: "", response: "" },
        },
      },
    ],
  };
};
