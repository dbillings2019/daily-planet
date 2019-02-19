var express = require('express');
var fs = require('fs');
var app = express();
var methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
    res.send("working");
});

app.get('/articles', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var myArticles = JSON.parse(articles);
    res.render('articles/index', {articles: myArticles});
});

app.get('/articles/new', function(req, res) {
    res.render('articles/new');
});

app.post('/articles', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    articles = JSON.parse(articles);
    articles.push(req.body);
    fs.writeFileSync('./articles.json', JSON.stringify(articles));
    res.redirect('/articles');
});

app.get('/articles/:id', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    var myArticles = JSON.parse(articles);
    var articleIndex = parseInt(req.params.id);
    res.render('articles/show', {myArticle: myArticles[articleIndex]});
});

app.delete('/articles/:id', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    var myArticles = JSON.parse(articles);
    myArticles.splice(parseInt(req.params.id), 1);
    fs.writeFileSync('./articles.json', JSON.stringify(myArticles));
    res.redirect('/articles/');
});

app.get('/articles/:id/edit', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    var myArticles = JSON.parse(articles);
    var articleIndex = parseInt(req.params.id);
    res.render('articles/edit', {article: myArticles[articleIndex], articleId: articleIndex});
});

app.put('/articles/:id', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    articles = JSON.parse(articles);
    var articleId = parseInt(req.params.id);
    articles[articleId].title = req.body.name;
    articles[articleId].body = req.body.type;
    fs.writeFileSync('./articles.json', JSON.stringify(articles));
    res.redirect('/articles/' + articleId);
});

app.listen(3000);
