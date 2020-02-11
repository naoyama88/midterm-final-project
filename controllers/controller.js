const Article = require("../models/article");
const Comment = require("../models/comment");
const util = require("../util/util");
const url = require("url");

exports.getHomePage = (req, res, next) => {
  const filter = req.query.filter;
  Article.getAll().then(async articles => {
    let sortedArticles = await util.filterArticle(filter, articles);
    res.render("home", { articles: sortedArticles, filter });
  });
};

exports.createArticle = (req, res, next) => {
  res.render("create");
};

exports.postArticle = (req, res, next) => {
  const article = new Article(
    req.body.author,
    req.body.title,
    req.body.content,
    util.getRandomBgImg(),
    0,
    new Date()
  );
  article.save();
  res.redirect("/");
};

exports.detailArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  const isEditing = req.query.edit;

  Article.get(articleId).then(article => {
    article.date = util.getFormattedDate(article.date);
    const bgImgFile = article.image_url || util.getRandomBgImg();
    Comment.getAllComment().then(comments => {
      res.render("detail", {
        article,
        comments,
        editMode: isEditing,
        bgImgFile,
        editComment: req.query.editComment,
        editCommentId: req.query.editCommentId,
        createComment: req.query.createComment
      });
    });
  });
};

exports.deleteArticle = async (req, res, next) => {
  const articleId = req.body.articleId;
  Comment.deleteAllComment(articleId);
  await Article.delete(articleId);
  res.redirect("/");
};

exports.like = async (req, res, next) => {
  const articleId = req.body.articleId;
  const imgUrl = req.body.imgUrl;
  await Article.like(articleId);
  res.redirect("/articles/" + articleId + "?imgUrl=" + imgUrl);
};

exports.showCommentForm = (req, res, next) => {
  res.redirect(
    url.format({
      pathname: "/articles/" + req.query.articleId,
      query: {
        createComment: true
      }
    })
  );
};

exports.createComment = (req, res, next) => {
  const comment = new Comment(
    req.body.articleId,
    req.body.author,
    req.body.comment,
    0,
  );
  comment.saveComment();
  res.redirect("/articles/" + req.body.articleId);
};

exports.commentVote = async (req, res, next) => {
  const { id, vote, article_id } = req.body;
  let value = vote == 'agree'? 1: -1;
  await Comment.voteComment(id, value)
  res.redirect(`/articles/${article_id}`)
}

exports.editComment = (req, res, next) => {
  res.redirect(
    url.format({
      pathname: "/articles/" + req.query.articleId,
      query: {
        editComment: true,
        editCommentId: req.query.commentId
      }
    })
  );
};

exports.updateComment = async (req, res, next) => {
  await Comment.updateComment(
    req.body.commentId,
    req.body.author,
    req.body.comment
  );
  res.redirect("/articles/" + req.body.articleId);
};

exports.deleteComment = async (req, res, next) => {
  await Comment.deleteComment(req.body.commentId);
  res.redirect("/articles/" + req.body.articleId);
};

// API get all articles
exports.apiGetAllArticles = (req, res, next) => {
  Article.getAll().then(articles => {
    res.send(articles);
  });
}

// API get a article
exports.apiGetArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  Article.get(articleId).then(article => {
    res.send(article);
  });
}

// API get comments
exports.apiGetComments = (req, res, next) => {
  const articleId = req.params.articleId;
  Comment.getRelatedComment(articleId).then(comments => {
    res.send(comments);
  });
}

// API like a article
exports.apiLike = async (req, res, next) => {
  const articleId = req.body.articleId;
  await Article.like(articleId);
  res.send('ok');
}

exports.apiDeleteArticle = async (req, res, next) => {
  const articleId = req.body.articleId;
  Comment.deleteAllComment(articleId);
  await Article.delete(articleId);
  res.send('ok');
}

exports.apiCreateArticle = async (req, res, next) => {
  const article = new Article(
    req.body.author,
    req.body.title,
    req.body.content,
    util.getRandomBgImg(),
    0,
    new Date()
  );
  article.save();
  res.send('ok');
}

exports.apiCreateComment = async (req, res, next) => {
  const comment = new Comment(
    req.body.articleId,
    req.body.author,
    req.body.comment,
    0,
  );
  comment.saveComment();
  res.send('ok');
}

exports.apiCommentVote = async (req, res, next) => {
  const { id, vote, article_id } = req.body;
  let value = vote == 'agree'? 1: -1;
  await Comment.voteComment(id, value)
  res.send('ok');
}

exports.apiDeleteComment = async (req, res, next) => {
  await Comment.deleteComment(req.body.commentId);
  res.send('ok');
}

exports.apiUpdateComment = async (req, res, next) => {
  await Comment.updateComment(
    req.body.commentId,
    req.body.author,
    req.body.comment
  );
  res.send('ok');
}