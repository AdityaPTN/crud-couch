const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(3000, () => {
  console.log("Server started on 3000 Port");
});
app.use(express.static(__dirname + "/public"));
//Koneksivitas
const NodeCouchDb = require("node-couchdb");
const couch = new NodeCouchDb({
  auth: {
    user: "alifiana",
    pass: "alifiana123",
  },
});
const dbName = "mahasiswas";
const viewUrl = "_design/all_mahasiswas/_view/all";

couch.listDatabases().then(function (dbs) {
  console.log(dbs);
});

//Routing
//Read
app.get("/", (req, res) => {
  couch.get(dbName, viewUrl).then(
    ({ data, headers, status }) => {
      console.log(data.rows);
      res.render("index", {
        mahasiswas: data.rows,
      });
    },
    (err) => {
      res.send(err);
    }
  );
});

//Create
app.get("/add-mahasiswa", (req, res) => {
  res.render("add-mahasiswa");
});
app.post("/add-mahasiswa", (req, res) => {
  const nim = req.body.nim;
  const nama = req.body.nama;

  couch.uniqid().then(function (ids) {
    const id = ids[0];
    couch
      .insert(dbName, {
        _id: id,
        nim: nim,
        nama: nama,
      })
      .then(
        ({ data, headers, status }) => {
          res.redirect("/");
        },
        (err) => {
          res.send(err);
        }
      );
  });
});

//Update
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  couch.get(dbName, id).then(
    ({ data, headers, status }) => {
      console.log(data);
      res.render("edit-mahasiswa", {
        mahasiswa: data,
      });
    },
    (err) => {
      res.send(err);
    }
  );
});
app.post("/edit/:id", (req, res) => {
  const _id = req.body._id;
  const _rev = req.body._rev;
  const nim = req.body.nim;
  const nama = req.body.nama;
  couch
    .update(dbName, {
      _id: _id,
      _rev: _rev,
      nim: nim,
      nama: nama,
    })
    .then(
      ({ data, headers, status }) => {
        res.redirect("/");
      },
      (err) => {
        res.send(err);
      }
    );
});

//Delete
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const rev = req.body.rev;

  couch.del(dbName, id, rev).then(
    ({ data, headers, status }) => {
      res.redirect("/");
    },
    (err) => {
      res.send(err);
    }
  );
});
