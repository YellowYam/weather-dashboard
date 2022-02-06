
//Reference HTML 
var citySearch = $("#city-search");
var searchButton = $('#search-button');
var currentWeatherDisplay = $('#current-weather');
var cityNameDisplay = $('#city-name-display');
var fiveDayForecast = $('#five-day-forecast');
var fiveDayForcastHeader = $('#five-day-forecast-header');


//City search variables
var cityName = '';
var cityData = {};
var cityFiveDayData = {};

//Luxon setup
var DateTime = luxon.DateTime;



//Fetch server-side API data
function handleWeatherSearch() {

    //Setup API URL to get city coordinates
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
        
        //Extract coordinates from city search
        .then(function (data) {

            var coordinates = {
                longitude: data.coord.lon,
                latitude: data.coord.lat
            };

            return coordinates;

        })

        //Use coordinates in the OneCall API
        .then(function (coordinates) {
            var openWeatherAPIkey = "204cd8bda70bb395d61013c2ab681a00";

            //Swap the latitude and longitude into the OneCall api
            var newOpenWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='
                + coordinates.latitude + '&lon=' + coordinates.longitude + '&exclude=hourly,minutely' +
                '&units=imperial' + '&appid=' + openWeatherAPIkey;

            //Request city data
            fetch(newOpenWeatherURL)

                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                })

                //Capture the city data in a global variable
                //Pass the results to the render function.
                .then(function (data) {
                    cityData = data;
                    return cityData;
                })

                .then(function (cityData) {

                    //Clear the current weather board
                    if (currentWeatherDisplay.find('#current-weather-temp').length > 0 |
                        currentWeatherDisplay.find('#current-weather-wind').length > 0 |
                        currentWeatherDisplay.find('#current-weather-humidity').length > 0 |
                        currentWeatherDisplay.find('#current-weather-uvi').length > 0) {

                        currentWeatherDisplay.find('#current-weather-temp').remove();
                        currentWeatherDisplay.find('#current-weather-wind').remove();
                        currentWeatherDisplay.find('#current-weather-humidity').remove();
                        currentWeatherDisplay.find('#current-weather-uvi').remove();
                    }

                //Render HTML elements
                    //Weather icon element
                    var weatherIcon = $('<img>');
                    weatherIcon.attr('alt', cityData.current.weather[0].description);
                    weatherIcon.attr('src', "http://openweathermap.org/img/wn/" + cityData.current.weather[0].icon + "@2x.png")

                    //Weather data elements
                    var temp = $('<h3>');
                    temp.text(cityData.current.temp + " °F");
                    temp.attr('id', 'current-weather-temp');

                    var wind = $('<h3>');
                    wind.text(cityData.current.wind_speed + " MPH");
                    wind.attr('id', 'current-weather-wind');

                    var humidity = $('<h3>');
                    humidity.text(cityData.current.humidity + "%");
                    humidity.attr('id', 'current-weather-humidity');

                    var uvIndex = $('<h3>');
                    uvIndex.text(cityData.current.uvi);
                    uvIndex.attr('id', 'current-weather-uvi');

                    //Mem. Add class to styles.css and use addClass method
                    currentWeatherDisplay.css('border', '1px solid black');
                    currentWeatherDisplay.css('padding', '10px');

                    //Mem. Add datetime element
                    cityNameDisplay.text(cityName +
                        " (" +  DateTime.now().toLocaleString() +
                        ") ").append(weatherIcon);


                    currentWeatherDisplay.append(temp);
                    currentWeatherDisplay.append(wind);
                    currentWeatherDisplay.append(humidity);
                    currentWeatherDisplay.append(uvIndex);

                    //Clear the 5 Day Forecast

                //Render HTML elements
                    // DateTime.now().plus({ days: 1 }).toLocaleString()
                    fiveDayForcastHeader.text('Five Day Forecast:')


                    for(let i=0; i<5; i++){
                        var day = $('<div>');
                        day.addClass('card');

                        var date = $('<h3>');
                        date.text(DateTime.now().plus({ days: 1 }).toLocaleString());
                        day.append(date);

                        fiveDayForecast.append(day);
                    }
                    

                   
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


$(searchButton).on('click', handleWeatherSearch);