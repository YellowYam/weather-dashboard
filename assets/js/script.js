//Reference HTML 
var citySearch = $("#city-search");
var searchButton = $('#search-button');
var currentWeatherDisplay = $('#current-weather');
var cityNameDisplay = $('#city-name-display');


//City search variables
var cityName = '';
var cityData = {};




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
                + coordinates.latitude + '&lon=' + coordinates.longitude + '&exclude=hourly,daily,minutely' +
                '&units=imperial' + '&appid=' + openWeatherAPIkey;

            //Request city data
            fetch(newOpenWeatherURL)

                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                })

                .then(function (data) {
                    cityData = data;
                    return cityData;
                })

                .then(function (cityData) {
                  //Render HTML elements
                    //Weather icon
                    var weatherIcon = $('<img>');
                    weatherIcon.attr('alt', cityData.current.weather[0].description);
                    weatherIcon.attr('src', "http://openweathermap.org/img/wn/" + cityData.current.weather[0].icon + "@2x.png")

                    var temp = $('<h3>');
                    temp.text(cityData.current.temp + " °F")

                    var wind = $('<h3>');
                    var humidity = $('<h3>');
                    var uvIndex = $('<h3>');

                    currentWeatherDisplay.css('border', '1px solid black');

                    cityNameDisplay.text(cityName +
                        " " + cityData.timezone +
                        " ").append(weatherIcon);

                    currentWeatherDisplay.append(temp);
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