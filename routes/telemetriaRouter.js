var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(req.body);
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
    "seug@mingas.by",
    "ssta@mingas.by",
    "chizhem@mingas.by",
  ];
  const mailOptionsFormQuestionForEntity = {
    from: req.body.email, // sender address
     to: maillist, // for site
    //to: "elizavetka.chizh@gmail.com", // for me
    subject: "Заявка на получение доступа к телеметрии", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Сообщение от: ${req.body.name} ${req.body.email}</p>
        <ul>
        <li>Наименование организаци (согласно договора на газоснабжение): ${req.body.organization}</li>
         <li>Адрес объекта газопотребления почты: ${req.body.address}</li>
            <li>ФИО контактного лица: ${req.body.name}</li>
            <li>Контактный телефон контактного лица: ${req.body.phone}</li>
            <li>E-mail контактного лица: ${req.body.email}</li>
            <li>Номер SIM-карты: ${req.body.text}</li>
        </ul>
        `,
  };

  transporterFeedback.sendMail(
    mailOptionsFormQuestionForEntity,
    function (error, info) {
      if (error) {
        res.json({
          status: false,
          respMesg: "Форма не отправлена, попробуйте еще раз",
        });
      } else {
        if (info) {
          res.json({ status: true, respMesg: "Форма успешно отправлена, спасибо за вашу заявку!" });
        } else {
          res.json({ status: false, respMesg: "Ваша заявка обрабатывается, немного подождите!" });
        }
      }
    }
  );
});
module.exports = router;
