const express = require("express");
const request = require("request");
const cheerio = require("cheerio");

const router = express.Router();
const db = require("../models");
// default router //
router.get("/", (req, res) => {

    db.Article.find({})
        .then(function(dbArticle){
            const retrievedArticle = dbArticle;
            var hbsObj = {
                articles: dbArticle
            };
            res.render("home", hbsObj); 
        })
        .catch(function(err){
            res.json(err);
        });
});
// router for scraping //
router.get("/scrape", (req, res) => {
    console.log("start scraping");

    request("https://www.nytimes.com",(error, response, body) => {
     
    
        if(!error && response.statusCode === 200){
            const $ = cheerio.load(body);

            $("article").each(function(i, element){
                let result = {};

                result.headline = $(element).find("h2").text().trim();
                result.url = "https://nytimes.com" + $(element).find("a").attr("href");
                result.summary = $(element).find("p").text().trim() || "Summary not available";
                
                if(result.headline && result.url && result.summary){
                    db.Article.create(result)
                        .then(function(dbArticle){

                        })
                        .catch(function(err){
                            return res.json(err);
                        });
                };
            
            });

            res.redirect("/");
        } else{
            console.log("Error can't connect to NYTIMES");
        }

    })

    
});

//router for clearing articles// 

router.get("/clear", (req, res) => {

    db.Article.deleteMany({}, () => {
        console.log("cleared articles");
    })
    res.redirect("/");
});


module.exports = router;