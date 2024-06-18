var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const inlineBase64 = require("nodemailer-plugin-inline-base64");
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
  console.log(req.body);
  var maillist = ["chizhem@mingas.by"];

  const mailOptionsFormQuestionForEntity = {
    from: req.body.name, // sender address
    to: maillist, // for site
    subject:
      "Анкета - отзыв о качестве предоставленных УП «МИНГАЗ» услуг и произведенных товаров", // Subject line
    text: req.body.name,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>Анкету-отзыв заполнил: ${req.body.name}</p>
            <p>Наименование услуги/административной процедуры/произведенного товара УП «МИНГАЗ»: ${req.body.service}</p>
            <p>Дата заполнения анкеты: ${req.body.date}</p>
        <table style="border: 1px solid black; border-collapse: collapse">
          <thead>
            <tr>
              <th style="border: 1px solid black; padding: 0 0.5rem">Критерии оценки</th>
              <th style="border: 1px solid black; padding: 0 0.5rem">Оценка</th>
              <th style="border: 1px solid black; padding: 0 0.5rem">Комментарии (причины оценок «не вполне», «нет»), пожелания Заказчика</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid black">Качество товаров (услуг), предоставляемых Вам, соответствует Вашим ожиданиям?</td>
              <td style="border: 1px solid black">${req.body.answers[0].selectedOption}</td>        
               <td style="border: 1px solid black">${req.body.answers[0].comment}</td>          
            </tr>
             <tr>
              <td style="border: 1px solid black">Вас устраивает компетентность нашего персонала?</td>
              <td style="border: 1px solid black">${req.body.answers[1].selectedOption}</td>        
               <td style="border: 1px solid black">${req.body.answers[1].comment}</td>          
            </tr>
              <tr>
              <td style="border: 1px solid black">Вы удовлетворены сроками предоставления услуги (поставки товара)?</td>
              <td style="border: 1px solid black">${req.body.answers[2].selectedOption}</td>        
               <td style="border: 1px solid black">${req.body.answers[2].comment}</td>          
            </tr>
             <tr>
              <td style="border: 1px solid black">Оцените достаточно ли информации на сайте УП «МИНГАЗ»?</td>
              <td style="border: 1px solid black">${req.body.answers[3].selectedOption}</td>        
               <td style="border: 1px solid black">${req.body.answers[3].comment}</td>          
            </tr>
             <tr>
              <td style="border: 1px solid black">Вас устраивает оперативность реагирования на Ваши обращения в УП «МИНГАЗ»?</td>
              <td style="border: 1px solid black">${req.body.answers[4].selectedOption}</td>        
               <td style="border: 1px solid black">${req.body.answers[4].comment}</td>          
            </tr>
             <tr>
              <td style="border: 1px solid black">Вы удовлетворены культурой общения наших работников?</td>
              <td style="border: 1px solid black">${req.body.answers[5].selectedOption}</td>        
               <td style="border: 1px solid black">${req.body.answers[5].comment}</td>          
            </tr>
             <tr>
              <td style="border: 1px solid black">Устраивают ли Вас цены на выпускаемые товары и оказываемые услуги?</td>
              <td style="border: 1px solid black">${req.body.answers[6].selectedOption}</td>        
               <td style="border: 1px solid black">${req.body.answers[6].comment}</td>          
            </tr>
             <tr>
              <td style="border: 1px solid black">Удовлетворяет ли Вас качество применяемых материалов и комплектующих при производстве изделий (товара) УП «МИНГАЗ»?</td>
              <td style="border: 1px solid black">${req.body.answers[7].selectedOption}</td>        
               <td style="border: 1px solid black">${req.body.answers[7].comment}</td>          
            </tr>
             <tr>
              <td style="border: 1px solid black">Удовлетворены ли Вы сотрудничеством с УП «МИНГАЗ» в целом?</td>
              <td style="border: 1px solid black">${req.body.answers[8].selectedOption}</td>        
               <td style="border: 1px solid black">${req.body.answers[8].comment}</td>          
            </tr>
          </tbody>
        </table>
        `,
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
module.exports = router;
