let map;
let directionsService;
let directionsRenderer;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.7128, lng: -74.0060 }, // Centered at New York
        zoom: 12,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map });

    // Click listener for the map
    map.addListener("click", (event) => {
        addMarker(event.latLng);
        if (markers.length > 1) {
            calculateAndDisplayRoute();
        }
    });
}

function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    markers.push(marker);
}

function calculateAndDisplayRoute() {
    const waypoints = markers.slice(1, markers.length - 1).map(marker => ({
        location: marker.position,
        stopover: true
    }));

    directionsService.route({
        origin: markers[0].position,
        destination: markers[markers.length - 1].position,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.WALKING,
    }, (response, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(response);
        } else {
            window.alert("Could not display directions due to: " + status);
        }
    });
}

function clearRoute() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    directionsRenderer.setDirections({ routes: [] });
}

window.initMap = initMap;
