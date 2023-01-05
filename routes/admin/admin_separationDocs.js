const express = require("express");
const router = express.Router();
const SeparationDocs = require("../../models/separationDocuments");
const { isAdmin } = require("../../config/auth");
const alert = require("alert");

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
  var id = req.params._id;
  var separation = "";

  var documents = [];
  SeparationDocs.find({ _id: { $ne: id } })
    .populate("documents")
    .exec(function (err, separations) {
      if (err) console.log(err);

      res.render("admin/add_separations", {
        separations: separations,
        separation: separation,

        documents: documents,
      });
    });
});

router.post("/add-separations", function (req, res) {
  const separation = req.body.separation;

  const documents = req.body.documents.split(",");

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("admin/add_separations", {
      errors: errors,
      separation: separation,

      documents: documents,
    });
  } else {
    SeparationDocs.findOne({ separation: separation })
      .populate("documents")
      .exec(function (err, separations) {
        if (separations) {
          res.render("admin/add_separations", {
            separation: separation,

            documents: documents,
          });
        } else {
          var separations = new SeparationDocs({
            separation: separation,

            documents: documents,
          });
          separations.save(function (err) {
            if (err) {
              return console.log(err);
            }
            req.flash("success", "человек добавлен");
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

  SeparationDocs.findById(req.params.id, function (err, separations) {
    if (err) {
      console.log(err);
      res.render("admin/admin_separations");
    } else {
      res.render("admin/edit_separations", {
        errors: errors,
        documents: separations.documents,
        separation: separations.separation,
        id: separations._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-separations/:id", function (req, res) {
  // req.checkBody("name", "Название должно быть заполненым").notEmpty();
  // req.checkBody("image", "Описание должно быть заполненым").notEmpty();

  var separation = req.body.separation;
  var documents = req.body.documents.split(",");
  var id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_separations/edit-separations/" + id);
  } else {
    SeparationDocs.findOne(
      { separation: separation, _id: { $ne: id } },
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
