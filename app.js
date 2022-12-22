const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connecting to DB
mongoose.connect("mongodb://localhost:27017/wikiDB");

//schema for objects creation
const articleSchema = {
  title: String,
  content: String
};

//model with the name in singular and the schema
const Article = mongoose.model("Article", articleSchema);

////////////////////////////////Request Targetting All Articles//////////////////////////////////

//chained methods to /articles: app.route("/articles").get().post().delete();
app.route("/articles")

  .get(function (req, res) {
    //ModelName.find({condition, function (err, result)})
    //in this case the condition is empty
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      }
      else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added!");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    //ModelName.delete({condition, function (err, result)})
    //in this case the condition is empty
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("All deleted!");
      } else {
        res.send(err);
      }
    });
  });

/*
app.get("/articles", function(req, res){
  //ModelName.find({condition, function (err, result)})
  //in this case the condition is empty
  Article.find(function(err, foundArticles){
    if (!err){
      res.send(foundArticles);
    }
    else {
      res.send(err);
    }
  });
});

app.post("/articles", function (req, res) {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function (err) {
    if (!err) {
      res.send("Successfully added!");
    } else {
      res.send(err);
    }
  });
});

app.delete("/articles", function (req, res) {
  //ModelName.delete({condition, function (err, result)})
  //in this case the condition is empty
  Article.deleteMany(function (err) {
    if (!err) {
      res.send("All deleted!");
    } else {
      res.send(err);
    }
  });
});
*/

/////////////////////////////////Request Targetting A Specific Article////////////////////////////////

app.route("/articles/:articleTitle")

  .get(function (req, res) {

    Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle)
      } else {
        res.send("No articles matching that title was found.")
      }
    });

  })

  .put(function (req, res) {
    //ModelName.updateOne({condition}, {updates}, function(err, results){});
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Updated successfully!");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function (req, res) {
    //ModelName.updateOne({condition}, {$set: updates}, function(err, results){});
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      /*
      req.body is going to have the next structure
      
      req.body = {
        title: "Something",
        content: "Something"
      }
    
      OR
      
      req.body = {
        title: "Something"
      }
    
      OR
    
      req.body = {
        content: "Something"
      }
    
      */
      function (err) {
        if (!err) {
          res.send("Successfully updated!");
        } else {
          res.send(err);
        }
      }
    );
  })
  
  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if (!err){
          res.send("Deleted successfully!");
        } else {
          res.send(err);
        }
      }
    );
  });


app.listen(3000, function () {
  console.log("Server started on port 3000");
});