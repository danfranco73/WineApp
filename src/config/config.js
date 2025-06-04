// Exporting the configuration object based on the environment
// and the options passed to the program
import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();

program
    .option('-pr, --prod', 'enviroment')
    .option('-p, --port <type>', 'Port')
    
    .option('-m, --mongodb_url <type>', 'MongoDB URL')
    .option('-mu, --mongodb_user <type>', 'MongoDB User')
    .option('-mp, --mongodb_pass <type>', 'MongoDB Pass')
    .option('-pe, --persistence <type>', 'Persistence')
    .option('-an, --admin_name <type>', 'Admin Name')
    .option('-ae, --admin_email <type>', 'Admin Email')
    .option('-ap, --admin_password <type>', 'Admin Password')
    .option('-ci, --client_id <type>', 'Client ID')
    .option('-si, --secret_id <type>', 'Secret ID')
    .option('-um, --user_mailing <type>', 'User Mailing')
    .option('-ump, --user_mailing_pass <type>', 'User Mailing Pass')
    .option('-as, --account_sid <type>', 'Account SID')
    .option('-at, --auth_token <type>', 'Auth Token')
    .option('-s, --secret <type>', 'Secret');
program.parse(process.argv);

const options = program.opts();

const env = options.prod ? 'prod' : 'dev';

dotenv.config({
    path: `.env/env.${env}`,

});

export default {
    APP_NAME: "WineApp",
    SERVER: "local",
    PORT: process.env.PORT,
    MONGO_USER: process.MONGO_USER,
    MONGO_USER_PASS: process.MONGO_USER_PASS,
    MONGODB_URL: process.env.MONGODB_URI,
    MONGODB_USER: process.env.MONGODB_USER,
    MONGODB_PASS: process.env.MONGODB_PASS,
    PERSISTENCE: process.env.PERSISTENCE,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    CLIENT_ID: process.env.CLIENT_ID,
    SECRET_ID: process.env.SECRET_ID,
    USER_MAILING: process.env.USER_MAILING,
    USER_MAILING_PASS: process.env.USER_MAILING_PASS,
    ACCOUNT_SID: process.env.ACCOUNT_SID,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    SECRET: process.env.SECRET,
};