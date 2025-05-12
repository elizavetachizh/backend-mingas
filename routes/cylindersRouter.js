import express from "express";
const cylindersRouter = express.Router();
import nodemailer from "nodemailer";
/* GET users listing. */
cylindersRouter.get("/", function (req, res) {
  res.send(req.body);
});

cylindersRouter.post("/", (req, res) => {
  const transporterQuestionsForEntity = nodemailer.createTransport({
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
        console.log(`info:`, info);
        console.log(error);
        res.json({
          status: false,
          respMesg: "Заявка не отправлена, попробуйте еще раз!",
          responseCode: error.responseCode,
          response: error.response,
        });
      }
      if (info) {
        res.json({
          status: true,
          respMesg: "Форма успешно отправлена, спасибо за вашу заявку!",
        });
      }
    }
  );
});
export default cylindersRouter;
