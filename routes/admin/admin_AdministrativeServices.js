const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const AdministrativeServices = require("../../models/administrativeServices");
router.get("/", isAdmin, function (req, res) {
  var count;
  AdministrativeServices.count(function (err, c) {
    count = c;
  });
  AdministrativeServices.find(function (err, administration) {
    res.render("admin/admin_administration", {
      administration: administration,
      count: count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-administration", isAdmin, function (req, res) {
  var uniqueName = "";
  var maximumImplementationPeriod = "";
  var certificateValidityPeriod = "";
  var boardSize = "";
  var documents = "";
  var contactInform = "";
  var type = "";
  var typeAdministrativeService = "";
  res.render("admin/add_administration", {
    uniqueName: uniqueName,
    maximumImplementationPeriod: maximumImplementationPeriod,
    certificateValidityPeriod: certificateValidityPeriod,
    boardSize: boardSize,
    documents: documents,
    contactInform: contactInform,
    type: type,
    typeAdministrativeService: typeAdministrativeService
  });
});

router.post("/add-administration", (req, res) => {
  req.checkBody("uniqueName", "Название должно быть заполненым").notEmpty();

  var uniqueName = req.body.uniqueName;
  var maximumImplementationPeriod = req.body.maximumImplementationPeriod;
  var certificateValidityPeriod = req.body.certificateValidityPeriod;
  const boardSize = req.body.boardSize;
  const documents = req.body.documents;
  const contactInform = req.body.contactInform;
  const type = req.body.type;
  const typeAdministrativeService  = req.body.typeAdministrativeService
  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_administration", {
      errors: errors,
      uniqueName: uniqueName,
      maximumImplementationPeriod: maximumImplementationPeriod,
      certificateValidityPeriod: certificateValidityPeriod,
      boardSize: boardSize,
      documents: documents,
      contactInform: contactInform,
      type: type,
      typeAdministrativeService:typeAdministrativeService
    });
  } else {
    AdministrativeServices.findOne(
      {
        uniqueName: uniqueName,
        maximumImplementationPeriod: maximumImplementationPeriod,
        certificateValidityPeriod: certificateValidityPeriod,
        boardSize: boardSize,
        documents: documents,
        contactInform: contactInform,
        type: type,
        typeAdministrativeService:typeAdministrativeService
      },
      function (err, administration) {
        if (administration) {
          res.render("admin/add_administration", {
            uniqueName: uniqueName,
            maximumImplementationPeriod: maximumImplementationPeriod,
            certificateValidityPeriod: certificateValidityPeriod,
            boardSize: boardSize,
            documents: documents,
            contactInform: contactInform,
            type: type,
            typeAdministrativeService:typeAdministrativeService
          });
          console.log(administration);
        } else {
          var administrativeServices = new AdministrativeServices({
            uniqueName: uniqueName,
            maximumImplementationPeriod: maximumImplementationPeriod,
            certificateValidityPeriod: certificateValidityPeriod,
            boardSize: boardSize,
            documents: documents,
            contactInform: contactInform,
            type: type,
            typeAdministrativeService:typeAdministrativeService
          });
          administrativeServices.save(function (err) {
            if (err) {
              return console.log(err);
            }

            req.flash("success", "document добавлен");
            res.redirect("/admin/admin_administration");
          });
        }
      }
    );
  }
});

/*
 * GET edit product
 */
router.get("/edit-administration/:id/", function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  console.log(errors);
  AdministrativeServices.findById(
    req.params.id,
    function (err, administration) {
      console.log(administration);
      if (err) {
        console.log(err);
        res.render("admin/admin_administration");
      } else {
        res.render("admin/edit_administration", {
          errors: errors,
          id: administration._id,
          uniqueName: administration.uniqueName,
          maximumImplementationPeriod:
            administration.maximumImplementationPeriod,
          certificateValidityPeriod: administration.certificateValidityPeriod,
          boardSize: administration.boardSize,
          documents: administration.documents,
          contactInform: administration.contactInform,
          type: administration.type,
          typeAdministrativeService:administration.typeAdministrativeService
        });
      }
    }
  );
});

/*
 * POST edit product
 */
router.post("/edit-administration/:id", function (req, res) {
  req.checkBody("uniqueName", "Название должно быть заполненым").notEmpty();

  var uniqueName = req.body.uniqueName;
  var maximumImplementationPeriod = req.body.maximumImplementationPeriod;
  var certificateValidityPeriod = req.body.certificateValidityPeriod;
  const boardSize = req.body.boardSize;
  const documents = req.body.documents;
  const contactInform = req.body.contactInform;
  const type = req.body.type;
  const typeAdministrativeService = req.body.typeAdministrativeService
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_administration/edit-administration/" + id);
  } else {
    AdministrativeServices.findOne(
      {
        uniqueName: uniqueName,
        maximumImplementationPeriod: maximumImplementationPeriod,
        certificateValidityPeriod: certificateValidityPeriod,
        boardSize: boardSize,
        documents: documents,
        contactInform: contactInform,
        type: type,
        typeAdministrativeService:typeAdministrativeService
      },
      function (err, administration) {
        // console.log("post2", post);
        if (err) {
          console.log(err);
        }
        if (administration) {
          res.redirect("/admin/admin_administration");
        } else {
          AdministrativeServices.findById(id, function (err, administration) {
            if (err) return console.log(err);

            administration.uniqueName = uniqueName;
            administration.maximumImplementationPeriod =
              maximumImplementationPeriod;
            administration.certificateValidityPeriod =
              certificateValidityPeriod;
            administration.boardSize = boardSize;
            administration.documents = documents;
            administration.contactInform = contactInform;
            administration.type = type;
            administration.typeAdministrativeService=typeAdministrativeService
            administration.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "пост отредактирован!");
              alert("Пост отредактирован");
              res.redirect("/admin/admin_administration/");
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
router.get("/delete-administration/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  AdministrativeServices.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_administration/");
  });
});

module.exports = router;
