import express from "express";
const usersRouter = express.Router();
import nodemailer from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
/* GET users listing. */
usersRouter.get("/", function (req, res) {
  res.send(req.body);
});
usersRouter.post("/", (req, res) => {
  const transporter = nodemailer.createTransport({
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
  const file = req.body.information;
  var maillist = ["kc@mingas.by", "chizhem@mingas.by"];
  const mailOptions = {
    from: req.body.email, // sender address
    to: maillist, //for site
    subject: "Предоставление показаний счётчика газа", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
          <p>Тема: Предоставление показаний счётчика газа</p>
        <p>От ${req.body.name}</p>
        <h4>Сообщение:</h4>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Контактный телефон: ${req.body.phone}</li>
            <li>Адрес: ${req.body.address}</li>
            <li>Лицевой счёт: ${req.body.text}</li>
             <li>Показания: ${req.body.reading}</li>
            <img src="cid:uniq-name" alt="image"/>
        </ul>
        `,
    attachments: [
      {
        href: `${file}`,
        encoding: "base64",
      },
    ],
  };
  transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
  transporter.sendMail(mailOptions, function (error, info) {
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
export default usersRouter;
