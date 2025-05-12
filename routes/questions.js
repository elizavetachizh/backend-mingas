import express from "express";
const questionsRouter = express.Router();
import nodemailer from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
/* GET users listing. */
questionsRouter.get("/", function (req, res) {
  res.send(req.body);
});

questionsRouter.post("/", (req, res) => {
  const transporterQuestions = nodemailer.createTransport({
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
  var maillist = ["kc@mingas.by", "root@mingas.by", "chizhem@mingas.by"];
  const info = req.body.information;
  const mailOptionsFormQuestion = {
    from: req.body.email, // sender address
    // to: "odik.obrashenia@gmail.com", //for site
    to: maillist, // list of receivers
    subject: "Обращение физ. лиц", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Обращение от: ${req.body.name} / ${req.body.email}</p>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Контактный телефон: ${req.body.phone}</li>
            <li>Адрес: ${req.body.address}</li>
            <li>Тема обращения: ${req.body.text}</li>
        </ul>
           <p>Сообщение: ${req.body.message}</p> 
        `,

    attachments: [
      {
        // define custom content type for the attachment
        href: `${info}`,
        encoding: "base64",
      },
    ],
  };
  transporterQuestions.use(
    "compile",
    inlineBase64({ cidPrefix: "somePrefix_" })
  );
  transporterQuestions.sendMail(
    mailOptionsFormQuestion,
    function (error, info) {
      if (error) {
        res.status(400).json({
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
    }
  );
});
export default questionsRouter;
