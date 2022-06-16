window.onload = () => {
    if (!navigator.geolocation) {
        console.error(`Your browser doesn't support Geolocation`);
        return;
    }
    let nft_coords = getNftLocation();
    return navigator.geolocation.getCurrentPosition(function(position) {
        curr_lat = position.coords.latitude;
        curr_lon = position.coords.longitude;
        nft_lat = nft_coords[0];
        nft_lon = nft_coords[1];
        var distanceInMeters = 50;
        // = distance(curr_lat, curr_lon, nft_lat, nft_lon, "k") * 1000;
        console.log(
            "nft coord: ", { nft_lat, nft_lon },
            "current position coord: ",
            position.coords,
            "distance: ",
            distanceInMeters
        );
        if (distanceInMeters > 40) {
            // render nft curations
            console.log(
                "rendering nft coordinates, current distance: ",
                distanceInMeters
            );
            location.replace("../visit_nft/index.html");
        }
    });
};

function getNftLocation() {
    return [37.4259629, -122.0723533];
}

async function distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    } else {
        var radlat1 = (Math.PI * lat1) / 180;
        var radlat2 = (Math.PI * lat2) / 180;
        var theta = lon1 - lon2;
        var radtheta = (Math.PI * theta) / 180;
        var dist =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344;
        }
        if (unit == "N") {
            dist = dist * 0.8684;
        }
        return dist;
    }
}