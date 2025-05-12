import express from "express";
const feedbackRouter = express.Router();
import nodemailer from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
/* GET users listing. */
feedbackRouter.get("/", function (req, res, next) {
  res.send(req.body);
});

feedbackRouter.post("/", (req, res) => {
  const transporterFeedback = nodemailer.createTransport({
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
  var maillist = ["kc@mingas.by", "ssta@mingas.by", "chizhem@mingas.by"];
  const info = req.body.information;
  const mailOptionsFormQuestionForEntity = {
    from: req.body.email, // sender address
    // to: "elizavetka.chizh@gmail.com", //for me
    to: maillist, // for site
    subject: "Форма обратной связи", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Отзыв от: ${req.body.name}</p>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Контактный телефон: ${req.body.phone}</li>
            <li>Тема обращения: ${req.body.text}</li>
        </ul>
         <p>Текст сообщения: ${req.body.message}</p>  
        `,
    attachments: [
      {
        // define custom content type for the attachment
        href: `${info}`,
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
          respMesg: "Форма не отправлена, попробуйте еще раз!",
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
export default feedbackRouter;
