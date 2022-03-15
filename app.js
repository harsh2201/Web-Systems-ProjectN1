const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://harsh2201:aHef1wQgQ5BwZYTH@cluster0.b7vyk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
var express = require("express");

// const expressLayouts = require("express-ejs-layouts");
var ejs = require("ejs"),
  partials = require("express-partials");

var mongodb = require("mongodb");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(partials());
app.engine("html", require("ejs").renderFile); //renders .ejs as html

app.set("views", __dirname + "/views");

var router = express.Router();

// app.use(expressLayouts);
app.set("veiw engine", "ejs");

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("pages/index.html", { title: "Express" });
});

// module.exports = router;

//**************************************************************************

//***** mongodb get all of the Routes in Routes collection where frequence>=1

//      and sort by the name of the route.  Render information in the views/pages/mongodb.ejs

router.get("/mongodb", function (request, response) {
  client.connect(async (err) => {
    const db = client.db("Project-N1");

    var Routes = db.collection("Routes");

    if (err) throw err;

    //get collection of routes

    //get all Routes with frequency >=1

    await Routes.find({ frequency: { $gte: 0 } })
      .sort({ name: 1 })
      .toArray(function (err, docs) {
        if (err) throw err;

        response.render("pages/mongodb.html", { results: docs });
      });

    //close connection when your app is terminating.

    // db.close(function (err) {

    client.close(function (err) {
      if (err) throw err;
    });
  });
}); //end app.get

app.use(router);

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
