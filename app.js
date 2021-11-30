const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

//REQUEST TARGETING ALL ARTICLES

app.route("/articles")

.get(function(req, res) {
  Article.find({}, function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }

  });
})


.post(function(req, res) {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("successfully added a new article")
    }else{
      console.log(err);
    }
  });
})
.delete(function(req, res) {
  Article.deleteMany({}, function(err) {
    if (!err) {
      res.send("Successsfully deleted all articles");
    } else {
      res.send(err);
    }
  });
});

///////////////REQUEST TARGETING ALL ARTICLES//////////

app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);

    }else{
      res.send("No articles found ")
    }
  });
})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    // {overwrite: true},
    function(err){
      if(!err){
        res.send("successfully updated article.");
      }else{
        res.send(err);
      }
    }
  );
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully updated the article");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully deleted the article")
      }else{
        res.send(err);
      }
    }
  );
});



app.listen(3000, function(req, res) {
  console.log("everything is fine");
});
