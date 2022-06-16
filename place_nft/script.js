const myTimeout = setTimeout(myGreeting, 200000);

function myGreeting() {
    clearTimeout(myTimeout);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function someFunction() {
    await delay(5000);
}

window.onload = () => {
    return navigator.geolocation.getCurrentPosition(
        async function(position) {
            myGreeting();
            await delay(15000);
            location.replace("../original_ar/index.html");
        });
};