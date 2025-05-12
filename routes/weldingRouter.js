import express from "express";
const weldingRouter = express.Router();
import nodemailer from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
/* GET users listing. */
weldingRouter.get("/", function (req, res) {
  res.send(req.body);
});
weldingRouter.post("/", (req, res) => {
  const transporter = nodemailer.createTransport({
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
  const file = req.body.information;
  const maillist = ["kc@mingas.by", "chizhem@mingas.by"];
  const mailOptions = {
    from: req.body.email, // sender address
    to: maillist, //for site
    subject: "Выполнение работ с применением сварки", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
          <p>Тема: Выполнение работ с применением сварки</p>
        <p>От ${req.body.name}</p>
        <h4>Сообщение:</h4>
        <ul>
            <li>ФИО: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
             <li>Лицевой счёт: ${req.body.personal_account}</li>
            <li>Контактный телефон: ${req.body.phone}</li>
             <li>Адрес объекта: ${req.body.address}</li>
             <li>Расположение переносимого участка газопровода: ${req.body.location}</li>
               <li>Планируемое газовое оборудование: ${req.body.gas_equipment}</li>
             <li>Выполнен ли потолок (стена) из горючих материалов: ${req.body.flammable_materials}</li>
              <li>Способ обратной связи: ${req.body.feedback_method}</li>
            <img src="cid:uniq-name" alt="image"/>
        </ul>
        `,
    attachments: [
      {
        href: `${file}`,
        encoding: "base64",
      },
    ],
  };
  transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
  transporter.sendMail(mailOptions, function (error, info) {
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
export default weldingRouter;
