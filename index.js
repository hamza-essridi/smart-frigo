const express = require("express");
const path = require("path");
const app = express();

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
  if (t > -200) {

    var temperature = { val: t, createdAt: admin.firestore.FieldValue.serverTimestamp() };
    admin.firestore().collection("temperatures").add(temperature);
    res.send("temperature saved " + t);
  } else {
    res.send("temperature not saved ");
  }
});

app.get("/get-list", async (req, res) => {
  var d = new Date();
  d.setMinutes(d.getMinutes() - 60)
  var snapshot = await admin.firestore().collection("temperatures").orderBy("createdAt").where('createdAt', '>', d).get();
  var list = snapshot.docs.map((doc) => doc.data());
  //console.log(list);
  res.send(list);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
