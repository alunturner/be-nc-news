\c nc_news_test

SELECT COUNT(articles.article_id) as total_count
FROM articles
LEFT JOIN comments ON
comments.article_id = articles.article_id



