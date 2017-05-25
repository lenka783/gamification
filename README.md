# NativeScript application for Continuous Improvement of Software Engineer's skills

##Technologies:
 * [MongoDB] (https://www.mongodb.com/)
 * [LoopBack] (http://loopback.io)
 * [Angular2] (https://angular.io/)
 * [NativeScript] (https://www.nativescript.org/)
 * [Node.js] (https://nodejs.org/en/)

##Requirements
 * [Install Node.js and NPM] (https://nodejs.org/en/)
 * [Install MongoDB] (https://docs.mongodb.com/getting-started/shell/installation/)
 * Install Strongloop and NativeScript using following:
    ```
    $ npm install -g strongloop nativescript
    ```
 * You need to set up dependencies for each platform you want to develop the application in (iOS and android). 
    * iOS - it's available only for macOS: 
      * latest [Xcode] (https://itunes.apple.com/cz/app/xcode/id497799835?mt=12)
      * [Command line tools for Xcode] (https://developer.apple.com/download/more/) -> you need to log in and then find your version of macOS and Xcode
      * [CocoaPods] (https://guides.cocoapods.org/using/getting-started.html)
    * Android:
      * [JDK 8] (http://www.oracle.com/technetwork/java/javase/downloads/index.html) or a later stable version
      * [Android SDK] (https://developer.android.com/studio/index.html)


 ##Setup
 First you need to setup database. Once your MongoDB is installed and running, you need to create an instance. You can do this either on your local machine or on a remote server. You can setup an instance using following commands:
 ```
 $ mongo

 [ > use thesisDB
     switched to db thesisDB
   > db.createUser({ user: 'admin', pwd: 'admin', roles: ['readWrite'] })
 ```

 Then use following commands to setup your datasources.
 For mongodb specification use information of your own MongoDB instance.
 Database name have to match the existing database, in this case it is "thesisDB".
 ```
 $ cd thesis-api
 $ slc loopback:datasource
 [ ? Enter the data-source name: db
   ? Select the connector for db: In-memory db (supported by StrongLoop)
   Connector-specific configuration:
   ? window.localStorage key to use for persistence (browser only): 
   ? Full path to file for persistence (server only): ]
 $ slc loopback:datasource
 [ ? Enter the data-source name: mongodb
   ? Select the connector for mongodb: MongoDB (supported by StrongLoop)
   Connector-specific configuration:
   ? Connection String url to override other settings (eg: mongodb://username:password@hostname:port/database): 
   ? host: localhost
   ? port: 27017
   ? user: admin
   ? password: admin
   ? database: thesisDB]
 ```

Then run script createGames.js located in thesis-api/scripts in order to add games to the database.
Before you run it, change the variables "accountEmail" and "database" in the top section of the file according to your need.
You can run the script using following:
```
thesis-api/scripts user$  ./createGames.js
```


##Start the application

Right now, you are good to go. 
First, you need to have your mongoDB running. 
Then, you should start loopback application. 
You can do that with wollowing commands: 
```
$ cd thesis-api
$ npm start
```
Then you can start NativeScript with following commands, you can use either ios:
```
$ cd ../thesis-app
$ tns run ios
```
or android: 
```
$ cd ../thesis-app
$ tns run android
```
The loopback application defined in thesis-api is working with several models with which you can acquaint in thesis-api/common/models.
Check the data structure defined in *.json files.
If you want to test the application, after creating a user in an application, you can use createTestData.js script located in thesis-api/scripts.
You need to have an existing user with contributorName already created before running this script.
You can create the user by signing up for the application and then setting up the contributor name in update profile.
Before you run it, change the variables "accountEmail" and "database" in the file according to your need.
Then change the gitAddress in function createTestRepository to your git repository you want to test and change localAddressPath in function createRepositoryContributor to its local copy.
Afterwards you can run it using following:
```
thesis-api/scripts user$  ./createTestData.js
```

##Next steps

You can modify and use enclosed files createGames.js and createTestData.js when creating you own games or adding your own repositories.
All you need to do is just replace test data with your actual data.

Adding repositories and creating or deleting the relationship between a repository and an account is possible only through these script files, it can't be done within the application itself.
