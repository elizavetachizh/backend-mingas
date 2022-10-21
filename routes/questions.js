var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const inlineBase64 = require("nodemailer-plugin-inline-base64");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(req.body);
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
  var maillist = [
    "kc@mingas.by",
    // "ssta@mingas.by",
    "root@mingas.by",
    "chizhem@mingas.by",
  ];
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
      // {
      //   // define custom content type for the attachment
      //   href: `${info[1]}`,
      //   encoding: "base64",
      // },
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
        res.json({
          status: false,
          respMesg: "Завяка не отправлена, попробуйте еще раз!",
        });
      }
      if (info) {
        console.log(info);
        res.json({
          status: true,
          respMesg: "Форма успешно отправлена, спасибо за вашу заявку!",
        });
      }
    }
  );
});
module.exports = router;
