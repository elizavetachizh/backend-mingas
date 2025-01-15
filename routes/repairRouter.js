// var express = require("express");
import express from "express";
const repairRouter = express.Router();
import nodemailer from "nodemailer";
/* GET users listing. */
repairRouter.get("/", function (req, res) {
  res.send(req.body);
});

repairRouter.post("/", (req, res) => {
  const transporterRepair = nodemailer.createTransport({
    secure: true,
    host: "ms2.g-cloud.by",
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  var maillist = ["kc@mingas.by", "chizhem@mingas.by"];
  const mailOptionsRepair = {
    from: req.body.email, // sender address
    // to: "elizavetka.chizh@gmail.com", //for me
    to: maillist, // for site
    subject: "Заявка на ремонт газового оборудования", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Тема: Ремонт газового оборудования</p>
        <p>От: ${req.body.name} ${req.body.email}</p>
        <h4>Сообщение:</h4>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Контактный телефон: ${req.body.phone}</li>
            <li>Номер договора: ${req.body.text}</li>
            <li>Адрес: ${req.body.address}</li>
            <li>Тип оборудования: ${req.body.time}</li>
            <li>Желаемая дата выполнения работы: ${req.body.date}</li>
        </ul>
         <p>Неисправность: ${req.body.message}</p>  
        `,
  };
  transporterRepair.sendMail(mailOptionsRepair, function (error, info) {
    if (error) {
      res.json({
        status: false,
        respMesg: "Заявка не отправлена, попробуйте еще раз!",
      });
    }
    if (info) {
      res.json({
        status: true,
        respMesg: "Форма успешно отправлена, спасибо за вашу заявку!",
      });
    }
  });
});
export default repairRouter;
