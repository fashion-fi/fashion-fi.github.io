const myTimeout = setTimeout(myGreeting, 2000000);

function myGreeting() {
    clearTimeout(myTimeout);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function someFunction() {
    await delay(5000);
}

// getting places from APIs
async function loadPlaces(position) {
    const params = {
        radius: 300, // search places not farther than this value (in meters)
        clientId: "QK1HLVNMWI30QWPFU1HCL2CCKYU35Y2GUOZGQ5E4MWX1VLYO",
        clientSecret: "1D1BN0TVUSI5W0Y4ENA3WCU3HJ3O3OKRPF5RC1DGJIQY1EOG",
        version: "20300101", // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = "https://cors-anywhere.herokuapp.com/";

    const options = {
        method: 'GET',
        headers: {
            Accept: 'json',
            Authorization: 'fsq3mBC639bQyvVa6VrL6SFTYpqnG19Na6oseOBfKoZBq8w='
        }
    };

    // Foursquare API (limit param: number of maximum places to fetch)
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
    &ll=${position.latitude},${position.longitude}
    &radius=${params.radius}
    &client_id=${params.clientId}
    &client_secret=${params.clientSecret}
    &limit=30 
    &v=${params.version}`;

    const endpoint_v3 = `https://api.foursquare.com/v3/places/search?&ll=${position.latitude},${position.longitude}`;
    console.log(endpoint_v3);
    /*
    let response = await fetch(endpoint_v3, options)
        .then(response => response.json())
        .catch(err => console.error(err));;
    */
    let response = await fetch(endpoint);
    console.log(response.results);
    return response.results; // res.json();
}

function loadPlacesFromJson(position) {
    return fetch("./tmp.json").then((res) => {
        return res.json().then((resp) => {
            return resp.response.venues;
        });
    });
}

window.onload = () => {
    const scene = document.querySelector("a-scene");

    // first get current user location
    return navigator.geolocation.getCurrentPosition(
        async function(position) {
            // than use it to load from remote APIs some places nearby
            loadPlacesFromJson(position.coords).then((places) => {
                console.log(places);
                places.forEach((place) => {
                    console.log(place);
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    const placeText = document.createElement("a-link");
                    placeText.setAttribute(
                        "gps-entity-place",
                        `latitude: ${latitude}; longitude: ${longitude};`
                    );
                    placeText.setAttribute("title", place.name);
                    placeText.setAttribute("scale", "15 15 15");

                    placeText.addEventListener("loaded", () => {
                        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
                    });

                    scene.appendChild(placeText);
                    console.log("succesfully place ", place);
                });
            });
            myGreeting();
            await delay(5000);
            location.replace("../place_nft/index.html");
        },
        (err) => console.error("Error in retrieving position", err), {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};