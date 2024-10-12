const Scrappey = require('scrappey-wrapper');
const qs = require('qs');

// Replace the following details with your own details
const SCRAPPEY_API_KEY = 'API_KEY';

// Create an instance of Scrappey
const scrappey = new Scrappey(SCRAPPEY_API_KEY);

async function run() {

    /**
     * Creates a session with Scrappey
     * This session uses a premium proxy located in the United States
     */
    const session = await scrappey.createSession({
        premiumProxy: true,
        proxyCountry: "UnitedStates"
    })

    // Make a GET request to the target URL to retrieve cookies
    const cookies = await scrappey.get({
        url: "https://propwire.com/realestate/1352-Grant-St-Se/3095097",
        session: session.session
    });

    // Extract the CSRF token from the cookies
    const csrfToken = cookies.solution.cookies.find(cookie => cookie.name === 'XSRF-TOKEN').value;
    // Decode the CSRF token (it's URL-encoded)
    const decodedCsrfToken = decodeURIComponent(csrfToken);

    // Make a POST request to fetch the property listing details
    const listing = await scrappey.post({
        // POST data payload
        "postData": {
            "id": 3095097
        },
        // Custom headers required for the request
        "customHeaders": {
            "content-type": "application/json",
            "x-api-key": "",
            "x-requested-with": "XMLHttpRequest",
            "x-xsrf-token": decodedCsrfToken // Use the decoded CSRF token
        },
        // URL for the API endpoint
        "url": "https://propwire.com/pw_property_detail",
        // Use the same session as before
        "session": session.session
    })

    // Print the retrieved listing data
    console.log(JSON.stringify(listing, null, 2));

}

// Execute the main function
run();