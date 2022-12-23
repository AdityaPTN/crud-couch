# CouchDB CRUD
Kelompok 4 Manajemen Basis Data Kelas A
<ol>
<li> Aditya Pratama Taufik Nurjaman <strong>1207050003</strong></li>
<li> Aldi Fahluzi Muharam <strong>1207050008</strong></li>
<li> Alifia Nadiva Altafunnisa <strong>1207050012</strong></li>
</ol>
Link Video Youtube :

# Instalasi CouchDB
Download [CouchDB](https://couchdb.apache.org/)
<br>Dan install seperti biasa.
<br>kalau sudah, untuk mengeceknya bisa langsung buka localhost CouchDB di http://localhost:5984/_utils/


# Download Project
Command dalam terminal
```
git clone https://github.com/AdityaPTN/crud-couch.git
npm app.js
```

# Setup Connection to Database
Dalam app.js ubah konektivitas sesuai database.
```JS
const NodeCouchDb = require("node-couchdb");
const couch = new NodeCouchDb({
  auth: {
    user: "YOUR_USERNAME",
    pass: "YOUR PASSWORD",
  },
});
const dbName = "YOUR_COLLECTION";
const viewUrl = "YOUR_VIEW_URL";
```

# Endpoint
Contoh Penerapan Endpoint CRUD pada CouchDB di nodejs
## Konektivitas
```JS
const NodeCouchDb = require("node-couchdb");
const couch = new NodeCouchDb({
  auth: {
    user: "admin",
    pass: "123",
  },
});
const dbName = "mahasiswas";
const viewUrl = "_design/all_mahasiswas/_view/all";
```
## Read
```JS
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
```
## Create
```JS
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
```

## Update
```JS
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
```
## Delete
```JS
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
```
