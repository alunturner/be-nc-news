\c nc_news_test

SELECT articles.article_id, articles.author, articles.topic, COUNT(*) as comment_count
FROM articles
LEFT JOIN comments ON
comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY comment_count DESC

