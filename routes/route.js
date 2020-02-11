const express = require('express');
const controller = require('../controllers/controller');
// const router = express.Router();
const router = express();
const cors = require('cors');

const whitelist = ['http://localhost:3000', 'http://localhost:3001'];
const sameOrigin = undefined;
const corsOptions = {
  origin: function (origin, callback) {
    if (origin === sameOrigin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(cors(corsOptions));

router.get('/', controller.getHomePage);

router.get('/create', controller.createArticle);
router.post('/create', controller.postArticle);

router.get('/articles/:articleId', controller.detailArticle);
router.post('/like', controller.like);
router.post('/delete', controller.deleteArticle);

router.get('/comment/create', controller.showCommentForm);
router.post('/comment/create', controller.createComment);
router.post('/comment/vote', controller.commentVote);

router.get('/comment/edit', controller.editComment);
router.post('/comment/update', controller.updateComment);
router.post('/comment/delete', controller.deleteComment);

router.get('/api/getAllArticles', controller.apiGetAllArticles);
router.get('/api/getArticle/:articleId', controller.apiGetArticle);
router.get('/api/getComments/:articleId', controller.apiGetComments);
router.post('/api/deleteArticle', controller.apiDeleteArticle);
router.post('/api/createArticle', controller.apiCreateArticle);
router.post('/api/createComment', controller.apiCreateComment);
router.post('/api/comment/delete', controller.apiDeleteComment);
router.post('/api/comment/update', controller.apiUpdateComment);
router.post('/api/like', controller.apiLike);
router.post('/api/comment/vote', controller.apiCommentVote);

module.exports = router;