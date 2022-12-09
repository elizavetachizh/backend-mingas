var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(req.body);
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
  var maillist = ["kc@mingas.by", "chizhem@mingas.by"];
  const mailOptionsFormQuestionForEntity = {
    from: req.body.email, // sender address
     to: maillist, //for site
    // to: "chizhem@mingas.by", // for me
    subject: "Заявка на заказ баллонов СУГ 50 литров", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Тема: Заказ баллонов СУГ 50 литров</p>
        <p>От ${req.body.name}</p>
        <h4>Сообщение:</h4>
        <ul>
            <li>ФИО: ${req.body.name}</li>
               <li>Email: ${req.body.email}</li>
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
