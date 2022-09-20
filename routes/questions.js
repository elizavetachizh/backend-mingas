var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const inlineBase64 = require("nodemailer-plugin-inline-base64");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(req.body);
  console.log(req.body);
});

router.post("/", (req, res) => {
  const transporterQuestions = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "elizavetka.chizh@gmail.com",
      pass: "jugbujpdqhvpmdyh",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  const file = req.body.file;
  const document = req.body.document;
  const mailOptionsFormQuestion = {
    from: req.body.email, // sender address
    to: "elizavetka.chizh@gmail.com", // list of receivers
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