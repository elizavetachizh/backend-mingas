var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(req.body);
  console.log(req.body);
});

router.post("/", (req, res) => {
  const transporterRepair = nodemailer.createTransport({
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
    "chizhem@mingas.by",
  ];
  const mailOptionsRepair = {
    from: req.body.email, // sender address
   // to: "chizhem@mingas.by", //for me
     to: maillist, // for site
    subject: "Заявка на снятие счётчика в поверку", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Тема: Заявка на снятие счётчика в поверку</p>
        <p>От: ${req.body.name} ${req.body.email}</p>
        <p>Сообщение:</p>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Контактный телефон: ${req.body.phone}</li>
            <li>Номер договора (лицевого счёта): ${req.body.text}</li>
            <li>Адрес: ${req.body.address}</li>
            <li>Желаемая дата выполнения работы: ${req.body.date}</li>
        </ul>
        `,
  };
  transporterRepair.sendMail(mailOptionsRepair, function (error, info) {
    if (error) {
      res.json({
        status: false,
        respMesg: "Форма не отправлена, попробуйте еще раз",
      });
    } else {
      res.json({ status: true, respMesg: "Форма успешно отправлена" });
    }
  });
});
module.exports = router;
