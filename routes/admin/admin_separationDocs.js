const express = require("express");
const router = express.Router();
const SeparationDocs = require("../../models/separationDocuments");
const { isAdmin } = require("../../config/auth");
const alert = require("alert");
const RegulatoryDocSchema = require("../../models/regulatoryDocuments");

router.get("/", isAdmin, function (req, res) {
  var count;
  SeparationDocs.count(function (err, c) {
    count = c;
  });
  SeparationDocs.find({})
    .populate("documents")

    .exec(function (err, separation) {
      if (err) {
        console.log(err);
      }
      res.render("admin/admin_separations", {
        separation: separation,
      });
    });
});
/*
 * GET add product
 */
router.get("/add-separations", isAdmin, function (req, res) {
  var separation = "";
  var documents = [];
  RegulatoryDocSchema.find(function (err, separations) {
    if (err) console.log(err);

    res.render("admin/add_separations", {
      separations,
      separation,
      documents,
    });
  });
});

router.post("/add-separations", function (req, res) {
  const separation = req.body.separation;
  const documents = req.body.documents;

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("admin/add_separations", {
      errors,
      separation,
      documents,
    });
  } else {
    SeparationDocs.findOne({ separation })
      .populate("documents")
      .exec(function (err, separations) {
        if (separations) {
          res.render("admin/add_separations", {
            separation,
            documents,
          });
        } else {
          var newSeparations = new SeparationDocs({
            separation,
            documents,
          });
          newSeparations.save(function (err) {
            if (err) {
              return console.log(err);
            }
            req.flash("success", "Документ добавлен");
            res.redirect("/admin/admin_separations");
          });
        }
      });
  }
});

/*
 * GET edit product
 */
router.get("/edit-separations/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  RegulatoryDocSchema.find(function (err, documents) {
    SeparationDocs.findById(req.params.id, function (err, separations) {
      if (err) {
        console.log(err);
        res.render("admin/admin_separations");
      } else {
        res.render("admin/edit_separations", {
          errors,
          documents: separations.documents,
          separation: separations.separation,
          id: separations._id,
          listDocuments: documents,
        });
      }
    });
  });
});

/*
 * POST edit product
 */
router.post("/edit-separations/:id", function (req, res) {
  req.checkBody("separation", "Название должно быть заполненым").notEmpty();

  var separation = req.body.separation;
  var documents = req.body.documents;
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_separations/edit-separations/" + id);
  } else {
    SeparationDocs.findOne(
      { separation, _id: { $ne: id }, documents },
      function (err, separations) {
        if (err) return console.log(err);

        if (separations) {
          res.redirect("/admin/admin_separations");
        } else {
          SeparationDocs.findById(id, function (err, separations) {
            if (err) console.log(err);
            separations.separation = separation;
            separations.documents = documents;

            separations.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "пост отредактирован!");
              alert("Пост отредактирован");
              res.redirect("/admin/admin_separations");
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
router.get("/delete-separations/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  SeparationDocs.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_separations/");
  });
});

module.exports = router;
