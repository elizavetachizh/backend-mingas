import alert from "alert";
import Prices from "../models/prices.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const getPrices = async (req, res) => {
  var count;
  Prices.count(function (err, c) {
    count = c;
  });
  Prices.find()
    .sort({ _id: -1 })
    .exec(function (err, prices) {
      res.render("admin/prices/admin_prices", {
        prices,
        count,
      });
    });
};

export const uploadPrice = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  var name = req.body.name;
  var date = req.body.date;

  const fileName = req.file.filename; // Убедитесь, что здесь нет слешей
  const uploadsDir = 'doc'; // Папка для загрузок

  // Используйте path.join для формирования пути
  const filePath = path.join(uploadsDir, fileName);

  var errors = req.validationErrors();
  console.log('Current Directory:', __dirname);
  console.log('Uploads Directory:', uploadsDir);
  console.log('Filename:', req.file.filename);
  console.log('Full File Path:', filePath);
  if (errors) {
    res.render("admin/prices/add_price", {
      errors,
    });
  } else {
    const newPrice = await new Prices({
      name,
      date,
      file:filePath,
    });
    await newPrice.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Пост добавлен");
      res.redirect("/admin/admin_prices");
    });
  }
};

export const getPriceById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const price = await Prices.findById(req.params.id);
    console.log(price);
    if (!price) return res.status(404).json({ error: "User not found" });
    res.render("admin/prices/edit_price", {
      errors,
      name: price.name,
      date: price.date,
      file: price.file,
      id: price._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePrice = async (req, res) => {
  try {
    req.checkBody("name", "Имя должно быть заполненым").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin_prices");
    } else {
      const price = await Prices.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!price) return res.status(404).json({ error: "Не было найдено" });
      alert("Прайс отредактирован");
      res.redirect("/admin/admin_prices");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePrice = async (req, res) => {
  try {
    const tender = await Prices.findByIdAndDelete(req.params.id);
    if (!tender) return res.status(404).json({ error: "User not found" });
    alert("Прайс был удален");
    res.redirect("/admin/admin_prices/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
