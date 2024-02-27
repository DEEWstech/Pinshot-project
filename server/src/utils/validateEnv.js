import {cleanEnv} from "envalid" //sets up environmental
import { str, port } from "envalid/dist/validators.js";

export default cleanEnv(process.env, {
    MONGODB_URL: str(),
    PORT: port(),
    JWT_ACCESS_TOKEN:str(),
    MY_BREVO_KEY: str(),
    HOST: str(),
    USER_MAIL_LOGIN: str(),
    BREVO_PORT: port(),
    BASE_URL: str(),
});