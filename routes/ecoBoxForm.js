import express from "express";
const exoBoxFormRouter = express.Router();
import nodemailer from "nodemailer";
/* GET users listing. */
exoBoxFormRouter.get("/", function (req, res, next) {
  res.send(req.body);
});

exoBoxFormRouter.post("/", (req, res) => {
  const ecoBoxTransporter = nodemailer.createTransport({
    secure: false,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  const maillist = ["Zorina983@mail.ru", "chizhem@mingas.by"];
  const mailOptionsFormQuestionForEntity = {
    from: req.body.email, // sender address
    // to: "elizavetka.chizh@gmail.com", //for me
    to: maillist, // for site
    subject: "Заявка на расчёт ECOBOX", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Заявка от: ${req.body.name}</p>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Контактный телефон: ${req.body.phone}</li>
            <li>Тип объекта: ${req.body.type}</li>
        </ul>
        `,
  };
  ecoBoxTransporter.sendMail(
    mailOptionsFormQuestionForEntity,
    function (error, info) {
      if (error) {
        res.json({
          status: false,
          respMesg: "Форма не отправлена, попробуйте еще раз!",
        });
      }
      if (info) {
        res.json({
          status: true,
          respMesg: "Форма успешно отправлена, спасибо за вашу заявку!",
        });
      }
    }
  );
});
export default exoBoxFormRouter;
