import express from "express"
const adminAdministrativeServicesRouter = express.Router();
import {isAdmin} from "../../config/auth.js"
import alert from "alert"
import AdministrativeServices from  "../../models/administrativeServices.js"
adminAdministrativeServicesRouter.get("/", isAdmin, function (req, res) {
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
adminAdministrativeServicesRouter.get("/add-administration", isAdmin, function (req, res) {
  var uniqueName = "";
  var maximumImplementationPeriod = "";
  var certificateValidityPeriod = "";
  var boardSize = "";
  var documents = "";
  var contactInform = "";
  var type = "";
  var typeAdministrativeService = "";
  res.render("admin/add_administration", {
    uniqueName,
    maximumImplementationPeriod,
    certificateValidityPeriod,
    boardSize,
    documents,
    contactInform,
    type,
    typeAdministrativeService,
  });
});

adminAdministrativeServicesRouter.post("/add-administration", (req, res) => {
  req.checkBody("uniqueName", "Название должно быть заполненым").notEmpty();
  var uniqueName = req.body.uniqueName;
  var maximumImplementationPeriod = req.body.maximumImplementationPeriod;
  var certificateValidityPeriod = req.body.certificateValidityPeriod;
  const boardSize = req.body.boardSize;
  const documents = req.body.documents;
  const contactInform = req.body.contactInform;
  const type = req.body.type;
  const typeAdministrativeService = req.body.typeAdministrativeService;
  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_administration", {
      errors,
    });
  } else {
    var administrativeServices = new AdministrativeServices({
      uniqueName,
      maximumImplementationPeriod,
      certificateValidityPeriod,
      boardSize,
      documents,
      contactInform,
      type,
      typeAdministrativeService,
    });
    administrativeServices.save(function (err) {
      if (err) {
        return console.log(err);
      }

      req.flash("success", "document добавлен");
      res.redirect("/admin/admin_administration");
    });
  }
});

/*
 * GET edit product
 */
adminAdministrativeServicesRouter.get("/edit-administration/:id/", function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  console.log(errors);
  AdministrativeServices.findById(
    req.params.id,
    function (err, administration) {
      if (err) {
        console.log(err);
        res.render("admin/admin_administration");
      } else {
        res.render("admin/edit_administration", {
          errors,
          id: administration._id,
          uniqueName: administration.uniqueName,
          maximumImplementationPeriod:
            administration.maximumImplementationPeriod,
          certificateValidityPeriod: administration.certificateValidityPeriod,
          boardSize: administration.boardSize,
          documents: administration.documents,
          contactInform: administration.contactInform,
          type: administration.type,
          typeAdministrativeService: administration.typeAdministrativeService,
        });
      }
    }
  );
});

/*
 * POST edit product
 */
adminAdministrativeServicesRouter.post("/edit-administration/:id", function (req, res) {
  req.checkBody("uniqueName", "Название должно быть заполненым").notEmpty();

  var uniqueName = req.body.uniqueName;
  var maximumImplementationPeriod = req.body.maximumImplementationPeriod;
  var certificateValidityPeriod = req.body.certificateValidityPeriod;
  const boardSize = req.body.boardSize;
  const documents = req.body.documents;
  const contactInform = req.body.contactInform;
  const type = req.body.type;
  const typeAdministrativeService = req.body.typeAdministrativeService;
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_administration/edit-administration/" + id);
  } else {
    AdministrativeServices.findById(id, function (err, administration) {
      if (err) return console.log(err);

      administration.uniqueName = uniqueName;
      administration.maximumImplementationPeriod = maximumImplementationPeriod;
      administration.certificateValidityPeriod = certificateValidityPeriod;
      administration.boardSize = boardSize;
      administration.documents = documents;
      administration.contactInform = contactInform;
      administration.type = type;
      administration.typeAdministrativeService = typeAdministrativeService;
      administration.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "пост отредактирован!");
        alert("Пост отредактирован");
        res.redirect("/admin/admin_administration/");
      });
    });
  }
});

/*
 * GET delete product
 */
adminAdministrativeServicesRouter.get("/delete-administration/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  AdministrativeServices.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_administration/");
  });
});

export default adminAdministrativeServicesRouter;
