const {mailService} = require('../services/mail.service')
async function mailSendingHandler(req,res,next){
    const sendData = {
        emailFrom,
        emailTo,
        emailSubject,
        emailText
    } = req.body
    try{
    await  mailService.sendEmail(sendData);    
    console.log("Sucess");
    }
    catch(err)
    {
        throw err;
    }
}
module.exports = mailSendingHandler;