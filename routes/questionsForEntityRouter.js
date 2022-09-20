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
  const transporterQuestionsForEntity = nodemailer.createTransport({
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
  const mailOptionsFormQuestionForEntity = {
    from: req.body.email, // sender address
    to: "chizhem@mingas.by", // list of receivers
    subject: "Обращение юр. лиц", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Обращение от: ${req.body.name}</p>
        <ul>
            <li>Наименование юридического лица: ${req.body.organization}</li>
            <li>ФИО руководителя или лица, уполномоченного подписывать обращения: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Юридический адрес: ${req.body.address}</li>
            <li>Почтовый адрес: ${req.body.text}</li>
            <li>Почтовый индекс: ${req.body.index}</li>
        </ul>
         <p>Текст сообщения: ${req.body.message}</p>
        `,
    attachments: [
      {
        // define custom content type for the attachment
        href: `${document}`,
        encoding: "base64",
      },
    ],
  };
  transporterQuestionsForEntity.use(
    "compile",
    inlineBase64({ cidPrefix: "somePrefix_" })
  );
  transporterQuestionsForEntity.sendMail(
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
