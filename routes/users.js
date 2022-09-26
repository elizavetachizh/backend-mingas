var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const inlineBase64 = require("nodemailer-plugin-inline-base64");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(req.body);
  console.log(req.body)
});
router.post("/", (req, res) => {
  const transporter = nodemailer.createTransport({
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
  const file = req.body.file;
  res.send(req.body);
  var maillist = [
    "kc@mingas.by",
    "ssta@mingas.by",
    "chizhem@mingas.by",
  ];
  const mailOptions = {
    from: req.body.email, // sender address
    to: maillist, //for site
    //to: "elizavetka.chizh@gmail.com", // for me
    subject: "Предоставление показаний счётчика газа", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>От ${req.body.name}</p>
        <h3>Сообщение:</h3>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Контактный телефон: ${req.body.phone}</li>
            <li>Адрес: ${req.body.address}</li>
            <li>Желаемое время для связи: ${req.body.time}</li>
            <li>Лицевой счёт: ${req.body.text}</li>
            <img src="cid:uniq-name"/>
        </ul>
        `,
    attachments: [
      {
        href: `${file}`,
        cid: "uniq-name", //same cid value as in the html img src
      },
    ],
  };
  transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
  transporter.sendMail(mailOptions, function (error, info) {
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
