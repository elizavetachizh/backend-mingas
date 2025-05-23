import express from "express";
const verificationRouter = express.Router();
import nodemailer from "nodemailer";
/* GET users listing. */
verificationRouter.get("/", function (req, res) {
  res.send(req.body);
});

verificationRouter.post("/", (req, res) => {
  const transporterRepair = nodemailer.createTransport({
    secure: false,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  var maillist = ["kc@mingas.by", "chizhem@mingas.by"];
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
        <h4>Сообщение:</h4>
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
        respMesg: "Заявка не отправлена, попробуйте еще раз!",
      });
    }
    if (info) {
      res.json({
        status: true,
        respMesg: "Форма успешно отправлена, спасибо за вашу заявку!",
      });
    }
  });
});
export default verificationRouter;
