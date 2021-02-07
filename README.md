Introduction
------------

This project will register a new app to an existing Firebase project and save the Google Services file in a desired path.

## Installation
Install via npm:
    
    npm i os-firebase-project-creator


## Usage       
Require:
```js
var pc = require("os-firebase-project-creator")
```
     
      
# Register an Android app:     
```js    
    /**
     * Will register a new Android app to a given Firbase project
     *
     * @param projectName your project name
     * @param packageName your app's package name
     * @param appNickname the name which be displayed in the project
     * @param jsonFilePath the path to save the json file
     * @param puppeteerPage (optional) puppeteer page to use (if not specified, will create a new one)
     * @param fireFoxNightlyPath the path to your FireFox Nightly runner file
     * In Windows that's usually your firefox.exe file (like 'C:/Program Files/Firefox Nightly/firefox.exe').
     * In Mac that's usually your firefox file, located in your Firefox Nightly.app, inside the Applications dir
     * @param killBrowserAtTheEnd true to kill the created browser, false to keep it alive and return the page
     * @returns {Promise<void>} call this function via await
     */
    registerAndroidApp: async function (projectName,
                                        packageName,
                                        appNickname,
                                        jsonFilePath = null,
                                        puppeteerPage = null,
                                        fireFoxNightlyPath = '/Applications/Firefox Nightly.app/Contents/MacOS/firefox',
                                        killBrowserAtTheEnd = true) {
        return await _registerApp(projectName,
            packageName,
            appNickname,
            jsonFilePath,
            puppeteerPage,
            fireFoxNightlyPath,
            killBrowserAtTheEnd,
            ANDROID)
    },

    
```

# Register an iOS app:
```js  
    /**
     * Will register a new iOS app to a given Firbase project
     *
     * @param projectName your project name
     * @param bundleIdentifier your app's bundle identifier
     * @param appNickname the name which be displayed in the project
     * @param plistFilePath the path to save the plist file
     * @param puppeteerPage (optional) puppeteer page to use (if not specified, will create a new one)
     * @param fireFoxNightlyPath the path to your FireFox Nightly runner file
     * In Windows that's usually your firefox.exe file (like 'C:/Program Files/Firefox Nightly/firefox.exe').
     * In Mac that's usually your firefox file, located in your Firefox Nightly.app, inside the Applications dir
     * @param killBrowserAtTheEnd true to kill the created browser, false to keep it alive and return the page
     * @returns {Promise<void>} call this function via await
     */
    registerIOSApp: async function (projectName,
                                    bundleIdentifier,
                                    appNickname,
                                    plistFilePath = null,
                                    puppeteerPage = null,
                                    fireFoxNightlyPath = '/Applications/Firefox Nightly.app/Contents/MacOS/firefox',
                                    killBrowserAtTheEnd = true) {
        return await _registerApp(projectName,
            bundleIdentifier,
            appNickname,
            outputFilePath,
            puppeteerPage,
            fireFoxNightlyPath,
            killBrowserAtTheEnd,
            IOS)
    }
```


## Additional notes
This is an automated module which uses [os-puppeteer-helper](https://github.com/osfunapps/os-puppeteer-helper-npm) to automate the app registration. 

## Links
[npm os-puppeteer-helper](https://github.com/osfunapps/os-puppeteer-helper-npm)

## Licence
ISC

# os-firebase-project-creator-npm