/** Connect to Moralis server */
// require('dotenv').config();
const serverUrl = "https://8qrbrcscgeyh.usemoralis.com:2053/server"; // process.env.SERVER_URL
const appId = "dQEsA3DyqoLNm2kXD7Rt6fCjUBc2XFuxtorqR5Lt"; // process.env.APP_ID
Moralis.start({ serverUrl, appId });
let user = Moralis.User.current();

async function start() {
    document.querySelector("#app").style.display = "block";
    document.querySelector("#login_button").onclick = login;
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
    document.querySelector("#submit_button").onclick = placeNft;
    document.querySelector("#register_button").onclick = visitNft;
}

async function placeNft() {
    location.replace("../place_nft/index.html");
}

async function visitNft() {
    location.replace("../visit_nft/index.html");
}

start();