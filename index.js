const express = require("express");
const path = require("path");
const app = express();
//const port = 3000;
const port = process.env.PORT || 3000;
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});
app.get("/save", (req, res) => {
  var t = req.query.t;
  if (t) {

    var m = new Date();
    var dateString =
        m.getUTCFullYear() + "/" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2); 

    
    var temperature = { val: t, dt: dateString };

    admin.firestore().collection("temperatures").add(temperature);
    res.send("temperature saved " + t);
  } else {
    res.send("temperature not saved ");
  }
});
app.get("/get-list", async (req, res) => {
  var snapshot = await admin.firestore().collection("temperatures").get();
  var list = snapshot.docs.map((doc) => doc.data());

  //console.log(list);
  res.send(list);
});

app.get("/test", (req, res) => {
  let date_ob = new Date();
  console.log(date_ob);
  res.send(date_ob);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
