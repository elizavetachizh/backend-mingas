var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(req.body);
  console.log(req.body);
});

router.post("/", (req, res) => {
  const transporterQuestions = nodemailer.createTransport({
    secure: true,
    host: "ms2.g-cloud.by",
    port: 465,
    auth: {
      user: "chizhem@mingas.by",
      pass: "JlUqVN5tv98T",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  const document = req.body.document;
  const file = req.body.file;
  const mailOptionsFormQuestion = {
    from: req.body.email, // sender address
    to: "odik.obrashenia@gmail.com", //for site
   // to: "elizavetka.chizh@gmail.com", // list of receivers
    subject: "Обращение физ. лиц", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Обращение от: ${req.body.name}</p>
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
        href: `${document}`,
      },
      {
        // define custom content type for the attachment
        href: `${file}`,
        encoding: "base64",
      },
    ],
  };
  transporterQuestions.sendMail(
    mailOptionsFormQuestion,
    function (error, info) {
      if (error) {
        res.json({
          status: false,
          respMesg: "Форма не отправлена, попробуйте еще раз",
        });
      } else {
        res.json({ status: true, respMesg: "Форма успешно отправлена" });
      }
    }
  );
});
module.exports = router;