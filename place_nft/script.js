/** Connect to Moralis server */
// require('dotenv').config();
const serverUrl = "https://8qrbrcscgeyh.usemoralis.com:2053/server"; // process.env.SERVER_URL
const appId = "dQEsA3DyqoLNm2kXD7Rt6fCjUBc2XFuxtorqR5Lt"; // process.env.APP_ID
Moralis.start({ serverUrl, appId });
let user = Moralis.User.current();

async function start() {
    login();
}

async function login() {
    if (!user) {
        try {
            user = await Moralis.authenticate({ signingMessage: "Login Function" })
            initApp();
        } catch (error) {
            console.log(error)
        }
    } else {
        Moralis.enableWeb3();
        initApp();
    }
}

function initApp() {
    console.log("App init...");
}

async function submitNft() {}

start();