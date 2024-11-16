const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: "mlsn.dcac2ff340878404cbcfa5be55a561dec4be0471b93b51f2b9f051122016cb81",
});

const sentFrom = new Sender("petonggaming1996@gmail.com","MailerSend");

const recipients = [
  new Recipient("patong29149@gmail.com", "nakarin")
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setSubject("This is a Subject")
  .setHtml("<strong>This is the HTML content</strong>")
  .setText("This is the text content");

mailerSend.email
  .send(emailParams)
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
