import alert from "alert";
import PressCenterVideo from "../models/pressCenterVideo.js";

export const getPressCenterVideos = async (req, res) => {
  var count;
  PressCenterVideo.count(function (err, c) {
    count = c;
  });
  PressCenterVideo.find()
    .sort({ _id: -1 })
    .exec(function (err, videos) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      res.render("admin/pressCenterVideo/admin_pressCenterVideo", {
        videos,
        count,
      });
    });
};

export const createPressCenterVideo = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("link", "Ссылка должна быть заполнена").notEmpty();

  var name = req.body.name;
  var link = req.body.link;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/pressCenterVideo/add_pressCenterVideo", {
      errors,
      name,
      link,
    });
  } else {
    const newVideo = await new PressCenterVideo({
      name,
      link,
    });
    await newVideo.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Видео добавлено");
      res.redirect("/admin/admin_pressCenterVideo");
    });
  }
};

export const getPressCenterVideoById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const video = await PressCenterVideo.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Видео не найдено" });
    
    res.render("admin/pressCenterVideo/edit_pressCenterVideo", {
      errors,
      name: video.name,
      link: video.link,
      id: video._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePressCenterVideo = async (req, res) => {
  try {
    req.checkBody("name", "Название должно быть заполненым").notEmpty();
    req.checkBody("link", "Ссылка должна быть заполнена").notEmpty();

    var name = req.body.name;
    var link = req.body.link;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin/admin_pressCenterVideo/edit-info/" + id);
    } else {
      const video = await PressCenterVideo.findByIdAndUpdate(id, {
        name,
        link,
      }, {
        new: true,
      });
      
      if (!video) return res.status(404).json({ error: "Видео не найдено" });
      
      req.flash("success", "Видео отредактировано!");
      alert("Видео отредактировано!");
      res.redirect("/admin/admin_pressCenterVideo");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePressCenterVideo = async (req, res) => {
  try {
    const video = await PressCenterVideo.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ error: "Видео не найдено" });
    
    req.flash("success", "Видео удалено!");
    res.redirect("/admin/admin_pressCenterVideo/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
