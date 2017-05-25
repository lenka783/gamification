
import application = require("application");

//static variables definition for the application
export class Config {
    public static IOS_APP: boolean = application.ios ? true : false;

    public static BASE_URL:string = Config.IOS_APP ? 'http://0.0.0.0:3000' : 'http://10.0.2.2:3000';
    public static API_VERSION:string = 'api';
}