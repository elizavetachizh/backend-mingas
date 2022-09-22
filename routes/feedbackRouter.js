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
  const transporterFeedback = nodemailer.createTransport({
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
    "ssta@mingas.by",
    "chizhem@mingas.by",
    // "elizavetka.chizh@gmail.com",
  ];
  const file = req.body.file;
  const mailOptionsFormQuestionForEntity = {
    from: req.body.email, // sender address
    to: "elizavetka.chizh@gmail.com", //for me
    // to: maillist, // for site
    subject: "Форма обратной связи", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Отзыв от: ${req.body.name}</p>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Контактный телефон: ${req.body.phone}</li>
            <li>Адрес электронной почты: ${req.body.email}</li>
            <li>Тема обращения: ${req.body.text}</li>
        </ul>
         <p>Текст сообщения: ${req.body.message}</p>  
        `,
    attachments: [
      {
        // define custom content type for the attachment
        href: `${file}`,
        encoding: "base64",
      },
    ],
  };
  transporterFeedback.use(
    "compile",
    inlineBase64({ cidPrefix: "somePrefix_" })
  );
  transporterFeedback.sendMail(
    mailOptionsFormQuestionForEntity,
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
