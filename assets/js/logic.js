var fir_loc;
var sec_loc;
var map;
var infowindow;
lat_lng = {
    lat: 0,
    lng: 0
};
lat_lng_A = {
    lat: 0,
    lng: 0
};
lat_lng_B = {
    lat: 0,
    lng: 0
};
var Coords = [{
        lat: 0,
        lng: 0
    },
    {
        lat: 0,
        lng: 0
    }
];
let places_added = [];
$("#point_A").focus();


//go functio
$("#go").on("click", function (event) {
    $("#list_display").val("")
    event.preventDefault();
    fir_loc = $("#point_A").val().trim();
    sec_loc = $("#point_B").val().trim();
    $("#point_A_drop").text(fir_loc);
    $("#point_B_drop").text(sec_loc);
    calculateRoute(fir_loc, sec_loc);
    initMap();
    $("#point_A").val("");
    $("#point_B").val("");
})


//here is a function to help user type cities name by AUTOCOMPLETE 
function autoCompleteInput() {
    var autoComplete = new google.maps.places.Autocomplete(point_A);
    var autoComplete = new google.maps.places.Autocomplete(point_B)
}
//here is a function to initialize the map and will display SEATTLE as start point
function initialize() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var lat_lng = new google.maps.LatLng(44.04883192631558, -97.42737499999998);
    var myOptions = {
        zoom: 2,
        center: lat_lng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    directionsDisplay.setMap(map);
    var map = new google.maps.Map(document.getElementById("map_display"), myOptions);
    //calling the auto complete func in side the function to avoid having two calls back in js in html.
    autoCompleteInput();
}

//get Lat and Long for each location
function GetLatlong_A() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('point_A').value;
    geocoder.geocode({
        'address': address,
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            lat_lng_A.lat = latitude;
            lat_lng_A.lng = longitude;
            Coords[0].lat = latitude;
            Coords[0].lng = longitude;
            calculateRoute();
        }
    })
}; //end of latLong function

function GetLatlong_B() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('point_B').value;
    geocoder.geocode({
        'address': address,
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            lat_lng_B.lat = latitude;
            lat_lng_B.lng = longitude;
            Coords[1].lat = latitude;
            Coords[1].lng = longitude;
            calculateRoute();

        }
    })
}; //end of latLong function

//showing direction on map
function calculateRoute() {
    GetLatlong_B()
    GetLatlong_A();

    var myOptions = {
        zoom: 10,
        center: lat_lng_A,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Draw the map
    var mapObject = new google.maps.Map(document.getElementById("map_display"), myOptions);

    var directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
        origin: fir_loc,
        destination: sec_loc,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    directionsService.route(
        directionsRequest,
        function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                new google.maps.DirectionsRenderer({
                    map: mapObject,
                    directions: response
                });
            } else
                $("#lblError").append("Unable To Find Root");
        }
    );


    $("select").change(function () {
        var point_of_interest = "";
        $("select option:selected").each(function () {
            point_of_interest = $(this).val();
        });

        if ($("#drop_down_loc option:selected").text() === fir_loc) {
            map = new google.maps.Map(document.getElementById('map_display'), {
                //changing this will work to change point of interest location
                center: lat_lng_A,
                zoom: 8
            });
            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);

            service.nearbySearch({
                //changing this will work to change point of interest location
                location: lat_lng_A,
                radius: 50000,
                type: [point_of_interest]
            }, callback);

            function callback(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            }

            function createMarker(place) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'mouseover', function () {
                    infowindow.setContent("<button class = add_btn> Add to Places to Visit </button> " + '<div><strong>' + place.name + '</strong><br>' + place.vicinity + "</div>");
                    infowindow.open(map, this);
                    $(".add_btn").on("click", function () {
                        if (places_added.includes(place.name)) {
                            alert("Already Added");
                            return;
                        } else {
                            places_added.push(place.name);
                            console.log(places_added);
                            let list_display = $("#list_display");
                            let places_card = $("<div class= places_card></div>")
                            list_display.append(places_card)
                            places_card.append("<button id=remove class=btn-danger>Remove Me</button>");
                            places_card.append("<br><strong>" +place.name + "</strong><br>" + place.vicinity);
                        }
                    });

                });
            }
        } else if ($("#drop_down_loc option:selected").text() === sec_loc) {
            // console.log("false")
            map = new google.maps.Map(document.getElementById('map_display'), {
                //changing this will work to change point of interest location0

                center: lat_lng_B,
                zoom: 8
            });

            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            // console.log(Coords)

            service.nearbySearch({
                //changing this will work to change point of interest location
                location: lat_lng_B,
                radius: 50000,
                type: [point_of_interest]
            }, callback);

            function callback(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            }

            function createMarker(place) {
                // var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
                console.log(place.name)
                console.log(place.photos[0].getUrl());
                console.log(place.vicinity);

                google.maps.event.addListener(marker, 'mouseover', function () {
                    infowindow.setContent("<button class = add_btn> Add to Places to Visit </button> " + '<div><strong>' + place.name + '</strong><br>' + place.vicinity + "</div>");
                    infowindow.open(map, this);
                    $(".add_btn").on("click", function () {
                        if (places_added.includes(place.name)) {
                            alert("Already Added");
                            return;
                        } else {
                            places_added.push(place.name);
                            console.log(places_added);
                            let list_display = $("#list_display");
                            let places_card = $("<div class= places_card></div>")
                            list_display.append(places_card)
                            places_card.append("<button id=remove class=btn-danger>Remove Me</button>");
                            places_card.append("<br><strong>" +place.name + "</strong><br>" + place.vicinity);
                        }
                    });
                });
            }
        }
    })

}


function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById("map_display"), {
        zoom: 7,
        center: {
            lat: 41.85,
            lng: -87.65
        }
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("direction_display"));

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('point_A_drop').addEventListener('change', onChangeHandler);
    document.getElementById('point_B_drop').addEventListener('change', onChangeHandler);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var start = document.getElementById('point_A').value;
    var end = document.getElementById('point_B').value;
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
$("#remove").click("click",function(){
    console.log("clickk");
    
})

