const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
 
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
 
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });
 
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
 
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

// find all articles

.get(async (req, res) => {
    await Article.find().then(foundArticles => {
        res.send(foundArticles);
    }).catch(err => {
        console.log(err);
    })
})


// post an article, use body (form urlencoded) 
.post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save();

})

// delete many articles, or all
.delete((req, res) => {
    Article.deleteMany()
      .then((result) => {
        res.send("All articles deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  });

 // find a specific article
  app.route("/articles/:articleTitle")

  .get(function(req,res){

    Article.findOne({ title:req.params.articleTitle})
        .then((foundArticle)=>{
            res.send(foundArticle);
        })

    .catch(err=>{

      res.send(err);

    })

  })

 // put and patch an article 
  .put(function (req, res) {
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true})
      .then(function () {
        res.send("Succesfully updated article");
        })
      .catch(function (err) {
          res.send(err);
          })
    
    })

// delete one article
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle})
            .then(function () {
                res.send("Succesfully deleted article");
                })
            .catch(function (err) {
                  res.send(err);
                  })

        
    });

    // .patch(function(req,res){
 
    //     Article.updateOne(
    //       {title: req.params.articleTitle},
    //       {$set:req.body},
    //       function(err){
    //         if(!err){
    //           res.send("Successfully updated");
    //         }
    //         else{
    //           res.send("Error");
    //         }
    //       });
    //   });

 
// app.get("/articles", async (req, res) => {
//     await Article.find().then(foundArticles => {
//         res.send(foundArticles);
//     }).catch(err => {
//         console.log(err);
//     })
// });

// app.post("/articles", function(req, res){
//     console.log(req.query.title);
//     console.log(req.query.content);

//     const newArticle = new Article({
//         title: req.query.title,
//         content: req.query.content
//     })

//     newArticle.save();

// });

// app.delete("/articles", (req, res) => {
//     Article.deleteMany()
//       .then((result) => {
//         res.send("All articles deleted");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});