// Exporting the configuration object based on the environment
// and the options passed to the program
import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();

program
    .option('-pr, --prod', 'prod')
    .option('-p, --port <type>', 'Port')
    .option('-m, --mongodb_url <type>', 'MongoDB URL')
    .option('-pe, --persistence <type>', 'Persistence')
    .option('-an, --admin_name <type>', 'Admin Name')
    .option('-ae, --admin_email <type>', 'Admin Email')
    .option('-ap, --admin_password <type>', 'Admin Password')
    .option('-um, --user_mailing <type>', 'User Mailing')
    .option('-ump, --user_mailing_pass <type>', 'User Mailing Pass')
    .option('-as, --account_sid <type>', 'Account SID')
    .option('-at, --auth_token <type>', 'Auth Token');
program.parse(process.argv);

const options = program.opts();

const env = options.prod ? 'prod' : 'dev';

dotenv.config({
    path: `src/config/.env.${env}`,

});

 //console.log('options', program.opts());

export default {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URI,
    PERSISTENCE: process.env.PERSISTENCE,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    USER_MAILING: process.env.USER_MAILING,
    USER_MAILING_PASS: process.env.USER_MAILING_PASS ,
    ACCOUNT_SID: process.env.ACCOUNT_SID ,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
};