const database = require("../util/database");
const mongodb = require("mongodb");

class Comment {
  constructor(articleId, author, comment, vote) {
    this.article_id = articleId;
    this.author = author;
    this.comment = comment;
    this.vote = vote;
  }

  saveComment() {
    database
      .getDB()
      .collection("comments")
      .insertOne(this)
      .then(result => {
        console.log(result);
        console.log("success!");
      })
      .catch(err => {
        console.log(err);
      });
  }

  static getAllComment() {
    return database
      .getDB()
      .collection("comments")
      .find()
      .toArray()
      .then(result => {
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static getRelatedComment(articleId) {
    return database
      .getDB()
      .collection("comments")
      .find({article_id: articleId})
      .toArray()
      .then(result => {
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static getOneComment(commentId) {
    return database.getDB().collection('comments').findOne({ _id: new mongodb.ObjectId(commentId) });
  }

  static async deleteComment(id) {
    return database
      .getDB()
      .collection("comments")
      .deleteOne({ _id: new mongodb.ObjectId(id) });
  }

  static async deleteAllComment(articleId) {
    return database
      .getDB()
      .collection("comments")
      .deleteMany( { article_id: articleId } );
  }

  static updateComment(id, author, comment) {
    return database
      .getDB()
      .collection("comments")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { author: author, comment: comment } }
      );
  }

  static async voteComment(id, value) {
    let comment = await this.getOneComment(id)
    let newValue = comment.vote + value
    if(newValue <= 0) {
      newValue = 0;
    }
    return database.getDB().collection('comments')
           .updateOne({_id: new mongodb.ObjectId(id)}, {$set: {vote: newValue}});
  }
}

module.exports = Comment;
