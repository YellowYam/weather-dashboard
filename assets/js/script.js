//Reference HTML 
var citySearch = $("#city-search");
var searchButton = $('#search-button');

//City search variables
var longitude;
var latitude;




//Fetch server-side API data
function getAPI() {

    //Setup API URL
    cityName = citySearch.val();


    var openWeatherAPIkey = "204cd8bda70bb395d61013c2ab681a00";

    var openWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q="
        + cityName
        + "&appid="
        + openWeatherAPIkey;



    //Get latitude and longitude
    fetch(openWeatherURL)

        .then(function (response) {
            if (response.ok) {
                return response.json();
            }

        })

        .then(function (data) {

            var coordinates = {
                longitude: data.coord.lon,
                latitude: data.coord.lat
            };

            return coordinates;

        })

        .then(function (coordinates) {
            var openWeatherAPIkey = "204cd8bda70bb395d61013c2ab681a00";

            //Swap the latitude and longitude into the OneCall api
            var newOpenWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='
                + coordinates.latitude + '&lon=' + coordinates.longitude +
                '&appid=' + openWeatherAPIkey;

            //Request city data
            fetch(newOpenWeatherURL)

                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                })

                .then(function (data) {
                    console.log(data);
                })

                .catch(function (error) {
                    console.log(error);
                })
        })

        .catch(function (error) {
            console.log(error);
        }
        )


}


$(searchButton).on('click', getAPI);