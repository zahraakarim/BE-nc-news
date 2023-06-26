const endpoints = require('./endpoints.json')
const { selectTopics } = require('./news.model')

exports.getAllTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch((err) => {
        next(err)
    });
};