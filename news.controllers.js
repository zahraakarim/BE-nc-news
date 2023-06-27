const endpoints = require('./endpoints.json')
const { selectTopics, selectArticleById, selectAllArticles } = require('./news.model')

exports.getAllTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch((err) => {
        next(err)
    })
};

exports.getAllEndpoints = (req, res, next) => {
    res.status(200).send({endpoints})
    .catch((err) => {
        next(err)
    })
};

exports.getArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article});
    })
    .catch((err) => {
        next(err)
    }) 
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}