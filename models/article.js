const database = require('../util/database');
const mongodb = require('mongodb');

class Article {
  constructor(author, title, text, imageUrl, like = 0, date = new Date()) {
    this.title = title;
    this.author = author;
    this.text = text;
    this.like = like;
    this.image_url = imageUrl;
    this.date = date;
  }

  save() {
    database.getDB().collection('articles').insertOne(this);
  }

  static getAll() {
    return database.getDB().collection('articles').find().toArray()
  }

  static get(id) {
    return database.getDB().collection('articles').findOne({ _id: new mongodb.ObjectId(id) })
  }

  static delete(id) {
    return database.getDB().collection('articles').deleteOne({_id: new mongodb.ObjectId(id)});
  }

  static async like(id) {
    const collection = database.getDB().collection('articles');
    const whereClause = { _id: new mongodb.ObjectId(id) };
    const article = await collection.findOne(whereClause);
    return collection.updateOne(whereClause, { $set: { like: ++article.like } });
  }
}

module.exports = Article;