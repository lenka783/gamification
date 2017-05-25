
import application = require("application");

//static variables definition for the application
export class Config {
    public static BASE_URL:string = 'http://0.0.0.0:3000';
    public static API_VERSION:string = 'api';

    public static IOS_APP: boolean = application.ios ? true : false;
}