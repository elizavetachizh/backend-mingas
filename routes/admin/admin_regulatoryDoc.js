const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const RegulatoryDocSchema = require("../../models/regulatoryDocuments");
router.get("/", isAdmin, function (req, res) {
  var count;
  RegulatoryDocSchema.count(function (err, c) {
    count = c;
  });
  RegulatoryDocSchema.find(function (err, documents) {
    res.render("admin/admin_documents", {
      documents: documents,
      count: count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-documents", isAdmin, function (req, res) {
  var link = "";
  var separation = "";
  var type = "";
  var name = "";
  res.render("admin/add_documents", {
    link: link,
    separation: separation,
    type: type,
    name: name,
  });
});

router.post("/add-documents", (req, res) => {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("separation", "Описание должно быть заполненым").notEmpty();
  req.checkBody("name", "Картинка должна быть загружена").notEmpty();

  var link = req.body.link;
  var separation = req.body.separation;
  var name = req.body.name;
  const type = req.body.type;
  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_documents", {
      errors: errors,
      link: link,
      type: type,
      separation: separation,
      name: name,
    });
  } else {
    RegulatoryDocSchema.findOne(
      { name: name, link: link, type: type, separation: separation },
      function (err, document) {
        if (document) {
          res.render("admin/add_documents", {
            link: link,
            name: name,
            type: type,
            separation: separation,
          });
        } else {
          var document = new RegulatoryDocSchema({
            link: link,
            name: name,
            type: type,
            separation: separation,
          });
          document.save(function (err) {
            if (err) {
              return console.log(err);
            }

            req.flash("success", "document добавлен");
            res.redirect("/admin/admin_documents");
          });
        }
      }
    );
  }
});

/*
 * GET edit product
 */
router.get("/edit-documents/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  RegulatoryDocSchema.findById(req.params.id, function (err, document) {
    if (err) {
      console.log(err);
      res.render("admin/admin_documents");
    } else {
      res.render("admin/edit_documents", {
        errors: errors,
        link: document.link,
        type: document.type,
        name: document.name,
        separation: document.separation,
        id: document._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-documents/:id", function (req, res) {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();

  var link = req.body.link;
  var name = req.body.name;
  var separation = req.body.separation;
  var id = req.params.id;
  var type = req.body.type;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_documents/edit-documents/" + id);
  } else {
    RegulatoryDocSchema.findOne(
      { link: link, name: name, separation: separation },
      function (err, document) {
        if (err) {
          console.log(err);
        }
        if (document) {
          res.redirect("/admin/admin_documents");
        } else {
          RegulatoryDocSchema.findById(id, function (err, document) {
            if (err) return console.log(err);

            document.link = link;
            document.name = name;
            document.separation = separation;
            document.type = type;
            document.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "пост отредактирован!");
              alert("Пост отредактирован");
              res.redirect("/admin/admin_documents/edit-documents/" + id);
            });
          });
        }
      }
    );
  }
});

/*
 * GET delete product
 */
router.get("/delete-documents/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  RegulatoryDocSchema.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_documents/");
  });
});

module.exports = router;
