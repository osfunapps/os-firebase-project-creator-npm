/*
this is a self contained module for creating an ios/android app in firebase, and downloading the
google-services.json file to a given path
 */
const ph = require('os-puppeteer-helper');
const tools = require('os-tools');

// browser related instances
let page;
let browser;

// constants
const GOOGLE_SERVICES_FILE_NAME = "google-services.json";

const self = module.exports = {

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
                                       jsonFilePath) {
        const tuplee = await ph.createBrowser("about:blank")
        browser = tuplee[0]
        page = tuplee[1];
        // username and password

        // disable headless and add wait time
        // wait for the settings button, click on it and open settings
        await ph.navigateTo(page, 'https://console.firebase.google.com/',null , "div[class='project-display-name ng-star-inserted']", null);

        // navigate to project name
        await ph.clickOnElementContainsText(page, "div[class='project-display-name ng-star-inserted']", projectName, 0, "button[aria-label='Add an app']")
        await openCreateNewApp(iosOrAndroid);
        await fillForm(packageOrBundleName, appNickname);
        await saveJsonFileAndSubmitForm(jsonFilePath)

        // kill the browser
        await browser.close()
    },

};

async function openCreateNewApp(iosOrAndroid) {
    await ph.click(page, "button[aria-label='Add an app']", 500);
    let platformSelector = "";
    if(iosOrAndroid === "ios"){
        platformSelector = "button[name='p9e-app-button-ios']"
    } else {
        platformSelector = "button[name='p9e-app-button-android']"
    }

    await ph.click(page, platformSelector, 500, "div[class='c5e-input-container app-onboarding-details-app-nickname']:nth-of-type(1) input", null, 100)
    await ph.click(page, "div[class='c5e-input-container app-onboarding-details-app-nickname']:nth-of-type(1) input", 500)
}

// will initialize the form creation
async function fillForm(packageOrBundleName, appNickname) {
    // set package name
    await ph.setText(page, "input.ng-touched", packageOrBundleName);

    // set nickname
    await ph.setText(page, "div[class='c5e-input-container app-onboarding-details-app-nickname']:nth-of-type(1) input", appNickname);

    // click submit
    await ph.click(page, "button[type='submit']", 0, "a[class='mat-raised-button mat-primary']:nth-of-type(1)")
}

// will save the json file and submit the form
async function saveJsonFileAndSubmitForm(jsonFilePath) {
    const filePath = jsonFilePath + "/" + GOOGLE_SERVICES_FILE_NAME
    await tools.removeFile(filePath);
    await ph.downloadFile(page, jsonFilePath, "a[class='mat-raised-button mat-primary']:nth-of-type(1)");
    console.log("waiting 8 seconds until download finish")
    await tools.delay(8000)
    console.log("done waiting. exiting")
}
