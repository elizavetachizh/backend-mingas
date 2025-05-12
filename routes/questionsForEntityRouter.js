import express from "express";
const questionsForEntityRouter = express.Router();
import nodemailer from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
/* GET users listing. */
questionsForEntityRouter.get("/", function (req, res) {
  res.send(req.body);
});

questionsForEntityRouter.post("/", (req, res) => {
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
  var maillist = ["kc@mingas.by", "chizhem@mingas.by", "root@mingas.by"];
  const info = req.body.information;
  const mailOptionsFormQuestionForEntity = {
    from: req.body.email, // sender address
    to: maillist, //for site
    // to: "chizhem@mingas.by", // for me
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
        href: `${info}`,
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
          respMesg: "Заявка не отправлена, попробуйте еще раз!",
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
export default questionsForEntityRouter;
