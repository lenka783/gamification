
import { isIOS} from "platform";

//static variables definition for the application
export class Config {
    public static BASE_URL:string = isIOS ? 'http://0.0.0.0:3000' : 'http://147.231.235.215:3000';
    public static API_VERSION:string = 'api';
}