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
    "odik.obrashenia@yandex.by",
    "ssta@mingas.by",
    "chizhem@mingas.by",
      "root@mingas.by"
  ];
  const file = req.body.file;
  const document = req.body.document;
  const mailOptionsFormQuestionForEntity = {
    from: req.body.email, // sender address
     to: maillist, //for site
    //to: "chizhem@mingas.by", // for me
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
        if (info) {
          console.log(info)
          res.json({ status: true, respMesg: "Форма успешно отправлена, спасибо за вашу заявку!" });
        } else {
          res.json({ status: false, respMesg: "Ваша заявка обрабатывается, немного подождите!" });
        }
      }
    }
  );
});
module.exports = router;
