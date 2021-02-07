/*
this is a self contained module for creating an ios/android app in firebase, and downloading the
google-services.json file to a given path
 */
const ph = require('os-puppeteer-helper');
const tools = require('os-tools');
const fh = require('os-file-handler');

// browser related instances
let page;
let browser;

// constants
const GOOGLE_SERVICES_FILE_NAME = "google-services.json";
const PLIST_FILE_NAME = "GoogleService-Info.plist";
const IOS = 'iOS';
const ANDROID = 'Android';

const self = module.exports = {


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
    },


};

async function _registerApp(projectName,
                            appIdentifier,
                            appNickname,
                            outputFilePath,
                            puppeteerPage,
                            fireFoxNightlyPath,
                            killBrowserAtTheEnd,
                            iOSOrAndroid) {

    if (page == null) {
        // const tuplee = await ph.createFirefoxBrowser()
        const tuplee = await ph.createFirefoxBrowser("about:blank", 5, false, 1300, 768, fireFoxNightlyPath)
        browser = tuplee[0]
        page = tuplee[1];
    } else {
        page = puppeteerPage
    }
    // username and password

    // disable headless and add wait time
    // wait for the settings button, click on it and open settings
    await ph.navigateTo(page, 'https://console.firebase.google.com/', null, "div[class='project-display-name ng-star-inserted']", null);

    // navigate to project name
    await ph.clickOnElementContainsText(page, "div[class='project-display-name ng-star-inserted']", projectName, true, false, true, true, 0, "button[aria-label='Add an app']")
    await openCreateNewApp(iOSOrAndroid);
    await fillForm(appIdentifier, appNickname, iOSOrAndroid);
    if(outputFilePath != null) {
        await saveJsonFile(outputFilePath, iOSOrAndroid)
    }

    // kill the browser
    if (killBrowserAtTheEnd) {
        await browser.close()
    } else {
        return page
    }
}

async function openCreateNewApp(iosOrAndroid) {
    let addAppNode = await ph.getElementBySelector(page, "button[aria-label='Add an app']")
    if(addAppNode != null) {
        await ph.clickOnElement(page, addAppNode , 500);
    }
    let platformSelector = "";
    if (iosOrAndroid === IOS) {
        platformSelector = "button[name='p9e-app-button-ios']"
    } else if (iosOrAndroid === ANDROID) {
        platformSelector = "button[name='p9e-app-button-android']"
    }
    await tools.delay(1000)
    await ph.clickOnSelector(page, platformSelector, 500, "div[class='c5e-input-container app-onboarding-details-app-nickname']:nth-of-type(1) input", null, 100)
    await ph.clickOnSelector(page, "div[class='c5e-input-container app-onboarding-details-app-nickname']:nth-of-type(1) input", 500)
}

// will initialize the form creation
async function fillForm(packageOrBundleName, appNickname, iOSOrAndroid) {
    // set package name
    await ph.setTextToSelector(page, "input[placeholder='com.company.appname']", packageOrBundleName);

    // set nickname
    if (iOSOrAndroid === IOS) {
        await ph.setTextToSelector(page, "input[placeholder='My iOS App']", appNickname);
    } else if (iOSOrAndroid === ANDROID) {
        await ph.setTextToSelector(page, "input[placeholder='My Android App']", appNickname);
    }


    // click submit
    await ph.clickOnSelector(page, "button[type='submit']", 0)
    if(iOSOrAndroid === IOS) {
        return await ph.waitForSelectorWithText(page, 'span', ' Download GoogleService-Info.plist ', 1000, null, 0, true)
    } else if(iOSOrAndroid === ANDROID)
        return await ph.waitForSelectorWithText(page, 'span', ' Download google-services.json ', 1000, null, 0, true)
}

// will save the json file and submit the form
async function saveJsonFile(outputFilePath, iOSOrAndroid) {
    let filePath = ""
    if(iOSOrAndroid === IOS) {
        filePath = outputFilePath + "/" + PLIST_FILE_NAME
    } else if(iOSOrAndroid === ANDROID) {
        filePath = outputFilePath + "/" + GOOGLE_SERVICES_FILE_NAME
    }
    await fh.removeFile(filePath);
    await ph.setDownloadedFilesLocation(page, jsonFilePath)
    let downloadBtnEle = await ph.getElementByText(page, 'span', ' Download google-services.json ', true, false, true, true)
    await ph.clickOnElement(page, downloadBtnEle)
    console.log("waiting 8 seconds until download finish")
    await tools.delay(8000)
    console.log("done waiting. exiting")
}
