exports.generateAllPaths = () => {
  return {
    "/api": {
      GET: {
        description: "serves up all of the available endpoints of the api ",
        query: {},
        response: {
          path: {
            available_method: {
              description: "what will happen",
              query: { available: "queries" },
              response: { example: "data format" },
            },
          },
        },
      },
    },
    "/api/topics": {
      GET: {
        description: "serves up all of the topics of the articles",
        query: {},
        response: {
          topics: [
            {
              slug: "unique string identifying the topic",
              description: "description of that topic",
            },
          ],
        },
      },
    },
    "/api/users/:username": {
      GET: {
        description: "serves up an individual user by his unique username",
        query: {},
        response: {
          user: {
            username: "unique user identifier",
            avatar_url: "link to profile picture",
            name: "actual name of account owner",
          },
        },
      },
    },
    "/api/articles": {
      GET: {
        description: "serves up all of the articles",
        query: {
          sort_be: "column",
          order: "asc or desc only",
          author: "filter by author, alias for username",
          topic: "filter by topic",
        },
        response: {
          articles: [
            {
              author: "alias for username",
              title: "article title",
              article_id: "unique identifier",
              topic: "article topic",
              created_at: "date of creation, Date object",
              votes: "number of up/down votes, default 0",
              comment_count: "number of comments on this article",
            },
          ],
        },
      },
    },
    "/api/articles/:article_id": {
      GET: {
        description: "serves up an individual article by it's unique id",
        query: {
          sort_by: "any column",
          order: "asc or desc only",
          author: "filter by author, alias for username",
          topic: "filter by topic",
        },
        response: {
          articles: [
            {
              author: "alias for username",
              title: "article title",
              article_id: "unique identifier",
              topic: "article topic",
              created_at: "date of creation, Date object",
              votes: "number of up/down votes, default 0",
              comment_count: "number of comments on this article",
            },
          ],
        },
      },
      PATCH: {
        description:
          "allows article votes to be updated by submitting {inc_votes: integer}",
        query: {},
        response: {
          article: {
            author: "alias for username",
            title: "article title",
            article_id: "unique identifier",
            topic: "article topic",
            created_at: "date of creation, Date object",
            votes: "updated number of votes",
            comment_count: "number of comments on this article",
          },
        },
      },
    },
    "/api/articles/:article_id/comments": {
      GET: {
        description: "serves up all of the comments by article id",
        query: { sort_by: "column", order: "asc or desc only" },
        response: {
          comments: [
            {
              comment_id: "unique comment identifier",
              votes: "number of up/down votes",
              created_at: "timestamp Date object",
              author: "alias for username",
              body: "the text of the comment",
            },
          ],
        },
      },
      POST: {
        description:
          "allows new comment to be submitted to an article by it's article_id by an existing user",
        query: {},
        response: {
          comment: {
            comment_id: "unique comment identifier",
            article_id: "article being commented on",
            votes: "number of up/down votes",
            created_at: "timestamp Date object",
            author: "alias for username",
            body: "the text of the comment",
          },
        },
      },
    },
    "/api/comments/:comment_id": {
      PATCH: {
        description:
          "allows comment votes to be updated by submitting {inc_votes: integer}",
        query: {},
        response: {
          article: {
            comment_id: "unique comment identifier",
            article_id: "article being commented on",
            votes: "updated number of votes",
            created_at: "timestamp Date object",
            author: "alias for username",
            body: "the text of the comment",
          },
        },
      },
      DELETE: {
        description:
          "allows a comment to be deleted by unique id, responds status 204",
        query: {},
        response: {},
      },
    },
  };
};
