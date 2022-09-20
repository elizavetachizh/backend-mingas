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
  const mailOptionsFormQuestionForEntity = {
    from: req.body.email, // sender address
    to: "chizhem@mingas.by", // list of receivers
    subject: "Заявка на заказ баллонов СУГ 50 литров", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>От ${req.body.name}</p>
        <p>Тема: заказ баллонов СУГ 50 литров</p>
        <p>Сообщение</p>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Номер абонента: ${req.body.text}</li>
            <li>Адрес: ${req.body.address}</li>
            <li>Номер телефона: ${req.body.phone}</li>
        </ul>
        `,
  };

  transporterQuestionsForEntity.sendMail(
    mailOptionsFormQuestionForEntity,
    function (error, info) {
      if (error) {
        res.json({ status: true, respMesg: "Форма успешно отправлена" });
      } else {
        res.json({ status: true, respMesg: "Форма успешно отправлена" });
      }
    }
  );
});
module.exports = router;
