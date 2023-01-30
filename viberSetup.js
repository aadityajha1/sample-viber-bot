const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const winston = require('winston');
// const express = require('express');
// const app = express();
// const config = require('./config.json');

const VIBER_TOKEN = process.env.BOT_TOKEN;
const externalUrl = process.env.EXTERNAL_URL;
console.log(VIBER_TOKEN)
console.log(externalUrl)
// const pat
const today = new Date();
let newFilename = today.getFullYear() + "-" +( today.getMonth() + 1).toString().padStart(2, '0') + "-" + today.getDate() + "-" ;

const createBot = (app) => {
        let logger = winston.createLogger({
        exitOnError: false,
        transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'logs/'+ newFilename + 'app.log'})]
        });
    
        const bot = new ViberBot({
          logger: logger,
          authToken: VIBER_TOKEN,
          name: process.env.BOT_NAME,
          avatar: externalUrl + process.env.BOT_AVATAR

        });

        bot.on(BotEvents.SUBSCRIBED, response => {
            response.send(new TextMessage(`Hi ${response.userProfile.name}, my name is ${bot.name}!`));
          });
          bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
            response.send(new TextMessage(`I have received the following message: ${message}`));
          });
          // Bind the bot middleware to the app instance
          app.use('/viber/webhook' , bot.middleware());
          // Webhook will be used for receiving callbacks and user messages from Viber
          console.log(externalUrl)
          bot.setWebhook(externalUrl + '/viber/webhook').catch(error => {
            console.log('Error', error)
            logger.debug(`Error: The webhook ${externalUrl + '/viber/webhook'} cannot be set. ${error}`);
            // process.exit(1);
          });
        //   app.listen(config.port, () => {
        //     logger.info(`Application is running! Port: ${config.port}`);
        //   });

}

const setUpViber = () => {

}

module.exports = { createBot };