Introduction
------------

This project will register a new app to an existing Firebase project and save the Google Services file in a desired path.

## Installation
Install via npm:
    
    npm i os-firebase-project-creator


## Usage       
Require pc:
        
    var pc = require("os-firebase-project-creator")

     
      
Register an app:     
    
    await pc.registerFirebaseApp("MyFirebaseProject", "ios", "com.osfunapps.my-cool-app", "My Cool App", "/Users/home/Desktop")



## Function signature

    
    /**
     * will create a new app in a given Firbase project
     * @param projectName -> your project name
     * @param iosOrAndroid -> choose either 'ios' or 'android'
     * @param packageOrBundleName -> package/bundle name. For example: com.mlstudios.coolApp
     * @param appNickname -> the name which be displayed in the project
     * @param jsonFilePath -> the path to save the json file
     * @returns {Promise<void>} -> call this function via await
     */
    registerFirebaseApp: async function (projectName,
                                       iosOrAndroid,
                                       packageOrBundleName,
                                       appNickname,
                                       jsonFilePath)
                                       
## Additional notes
This is an automated module which uses [os-puppeteer-helper](https://github.com/osfunapps/os-puppeteer-helper-npm) to automate the app registration. 

## Links
[npm os-puppeteer-helper](https://github.com/osfunapps/os-puppeteer-helper-npm)

## Licence
ISC
#os-firebase-project-creator-npm
