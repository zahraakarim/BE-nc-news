const db = require('./db/connection')
const response = require('./app')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((response) => {
        return response.rows;
    })
}

exports.selectArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((response) => {
        if(!response.rows.length) {
            return Promise.reject({status: 404, msg: 'Path not found'})
        }
        return response.rows[0]
    })
}