const fs = require("fs");

exports.getFormattedDate = date => {
  return ('0' + date.getDate()).slice(-2)
    + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
    + '/' + date.getFullYear();
}

exports.mergeSort = (array) => {
  const sortedArr = [...array];
  if (sortedArr.length < 2) return array;
  const midPoint = Math.floor(sortedArr.length / 2);
  const leftArr = sortedArr.slice(0, midPoint);
  const rightArr = sortedArr.slice(midPoint);
  return this.merge(this.mergeSort(leftArr), this.mergeSort(rightArr));
}

exports.merge = (leftArr, rightArr) => {
  const result = [];
  while (leftArr.length && rightArr.length) {
    if (leftArr[0] <= rightArr[0]) {
      result.push(leftArr.shift());
    } else {
      result.push(rightArr.shift());
    }
  }
  return result.concat(leftArr, rightArr);
}

exports.reversArr = (array) => {
  const tmpArr = [...array];
  const result = [];
  while (tmpArr.length) {
    result.push(tmpArr.pop());
  }
  return result;
}

exports.filterArticle = (filter , articles) => {
  try {
  let result = [];
  if (filter === 'likes') {
    const likeArr = articles.map(article => {
      return article.like
    })
    const sortedLike = this.mergeSort(likeArr);
    const reversedLike = this.reversArr(sortedLike);
    reversedLike.forEach(like => {
      articles.forEach(article => {
        if (like === article.like) {
          result.push(article);
        }
      })
    })
  } else if (filter === 'oldest') {
    result = articles;
  } else {
    result =  this.reversArr(articles);
  }
  return result;
  } catch (err) {
    console.log(err)
  }
}

exports.getRandomBgImg = () => {
  const bgiImgFolder = __dirname + "/../public/img/article_background";
  const imgFiles = fs.readdirSync(bgiImgFolder);
  let bgImgFile = '/img/article_background/default.png';
  if (imgFiles && imgFiles.length !== 1) {
    bgImgFile =
      "/img/article_background/" +
      imgFiles[Math.floor(Math.random() * Math.floor(imgFiles.length))];
  }
  return bgImgFile;
}