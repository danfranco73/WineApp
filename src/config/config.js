import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();

program
    .option('-p, --port <type>', 'Port')
    .option('-m, --mongodb <type>', 'MongoDB URL')
    .option('-j, --jwt <type>', 'JWT Secret')
    .option('-a, --adminName <type>', 'Admin Name')
    .option('-e, --adminEmail <type>', 'Admin Email')
    .option('-w, --adminPassword <type>', 'Admin Password')
    .option('-s, --persistence <type>', 'Persistence')
    .option('-u, --userMailing <type>', 'User Mailing')
    .option('-k, --userMailingPass <type>', 'User Mailing Pass')
    .option('-t, --accountSid <type>', 'Account SID')
    .option('-o, --authToken <type>', 'Auth Token');
program.parse(process.argv);

const options = program.opts();

const env = options.persistence === 'true' ? 'prod' : 'dev';

dotenv.config({
    path: `.env.${env}`,
});

export default {
    PORT: process.env.PORT || 8080,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/ecommerce',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    PERSISTENCE: process.env.PERSISTANT || 'false',
    ADMIN_NAME: process.env.ADMIN_NAME || 'admin',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@localhost',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
    USER_MAILING: process.env.USER_MAILING || 'mailing@localhost',
    USER_MAILING_PASS: process.env.USER_MAILING_PASS || 'secret',
    ACCOUNT_SID: process.env.ACCOUNT_SID || 'ACXXXXXXXX',
    AUTH_TOKEN: process.env.AUTH_TOKEN || 'secret',
};