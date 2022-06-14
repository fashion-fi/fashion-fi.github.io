window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    if (!navigator.geolocation) {
        console.error(`Your browser doesn't support Geolocation`);
        return;
    }
    button.innerText = '﹖';
    let nft_place = getNftLocation();
    return navigator.geolocation.getCurrentPosition(function(position) {
            const { curr_lat, curr_lon } = position.coords;
            const { nft_lat, nft_lon } = nft_place;
            /* Invalid Google API Key
            var distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng({
                    lat: curr_lat,
                    lng: curr_lon
                }),
                new google.maps.LatLng({
                    lat: nft_lat,
                    lng: nft_lon
                })
            );
            */
            var distanceInMeters = distance(curr_lat, curr_lon, nft_lat, nft_lon, "k") / 1000;
            if (distanceInMeters < 40) {
                // render real nft
                renderNfts(nft_place)
            } else {
                // render geolocation
            }
        },
        (err) => console.error('Error in retrieving position', err), {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};

function getNftLocation() {
    return [37.4259629, -122.0723533];
}


function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}


var models = [{
        url: '../assets/magnemite/scene.gltf',
        scale: '0.5 0.5 0.5',
        info: 'Intro for nft1',
        rotation: '0 180 0',
    },
    {
        url: '../assets/articuno/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 180 0',
        info: 'Intro for nft2',
    },
    {
        url: '../assets/dragonite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Intro for nft3',
    },
];

function readShowInfo() {
    return fetch("./nft.json")
        .then(response => response.json());
}

var setModel = function(model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }
    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }
    if (model.position) {
        entity.setAttribute('position', model.position);
    }
    entity.setAttribute('gltf-model', model.url);
    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};

function renderNfts(places) {
    let scene = document.querySelector('a-scene');
    var entity = document.querySelector('[gps-entity-place]');

    models.forEach((model) => {
        let { latitude, longitude } = places;
        // add entity
        let new_model = document.createElement('a-entity');
        new_model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

        setModel(model, entity);

        model.setAttribute('animation-mixer', '');
        scene.appendChild(model);

        // add nft name
        const placeText = document.createElement('a-link');
        placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        placeText.setAttribute('title', model.info);
        placeText.setAttribute('scale', '15 15 15');

        placeText.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(placeText);
    });
}

function renderLocations(places) {
    let scene = document.querySelector('a-scene');
    var entity = document.querySelector('[gps-entity-place]');

    models.forEach((model) => {
        let { latitude, longitude } = places;
        // add entity
        let new_model = document.createElement('a-entity');
        new_model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

        setModel(model, entity);

        model.setAttribute('animation-mixer', '');
        scene.appendChild(model);

        // add nft name
        const placeText = document.createElement('a-link');
        placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        placeText.setAttribute('title', model.info);
        placeText.setAttribute('scale', '15 15 15');

        placeText.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(placeText);
    });
}