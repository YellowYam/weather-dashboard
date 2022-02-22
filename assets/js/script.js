
//Reference HTML 
var searchWindow = $('#search-window');
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
var searchHistoryButtons = [];

//Luxon setup
var DateTime = luxon.DateTime;



//Fetch server-side API data
function handleWeatherSearch(event) {
    
    //Setup API URL to get city coordinates
    cityName = citySearch.val();

    //If the user uses a search history button, get the city name from the button
    var target = $(event.target);
    

    if(target.text() != ''){
        cityName = target.text().toLowerCase();
    }


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

            else{
                alert('City not found!');
                citySearch.val('');
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
                        currentWeatherDisplay.find('#current-weather-uvi').length > 0 |
                        currentWeatherDisplay.find('#current-weather-uvi-label').length > 0
                    ) {

                        currentWeatherDisplay.find('#current-weather-temp').remove();
                        currentWeatherDisplay.find('#current-weather-wind').remove();
                        currentWeatherDisplay.find('#current-weather-humidity').remove();
                        currentWeatherDisplay.find('#current-weather-uvi').remove();
                        currentWeatherDisplay.find('#current-weather-uvi-label').remove();
                    }

                    //Render HTML elements
                    //Weather icon element
                    var weatherIcon = $('<img>');
                    weatherIcon.attr('alt', cityData.current.weather[0].description);
                    weatherIcon.attr('src', "http://openweathermap.org/img/wn/" + cityData.current.weather[0].icon + "@2x.png")

                    //Weather data elements
                    var temp = $('<h3>');
                    temp.text("Temp: " + cityData.current.temp + " °F");
                    temp.attr('id', 'current-weather-temp');

                    var wind = $('<h3>');
                    wind.text("Wind: " + cityData.current.wind_speed + " MPH");
                    wind.attr('id', 'current-weather-wind');

                    var humidity = $('<h3>');
                    humidity.text("Humidity: " + cityData.current.humidity + "%");
                    humidity.attr('id', 'current-weather-humidity');

                    var uvIndex = $('<h3>');
                    var uvIndex2 = $('<span>')
                    uvIndex.text("UV Index: ");
                    uvIndex.attr('id', 'current-weather-uvi-label');
                    uvIndex2.text(cityData.current.uvi);
                    uvIndex2.attr('id', 'current-weather-uvi');
                    uvIndex.append(uvIndex2);

                    //UV color coding
                    if (cityData.current.uvi < 3) {
                        uvIndex2.css('background-color', "green");
                    }

                    else if (cityData.current.uvi > 3 && cityData.current.uvi < 5) {
                        uvIndex2.css('background-color', "yellow");
                    }

                    else {
                        uvIndex2.css('background-color', "red");
                    }


                    //Mem. Add class to styles.css and use addClass method
                    currentWeatherDisplay.css('border', '1px solid black');
                    currentWeatherDisplay.css('padding', '10px');

                    //Mem. Add datetime element
                    cityNameDisplay.text(cityName +
                        " (" + DateTime.fromSeconds(cityData.daily[0].dt).toLocaleString() +
                        ") ").append(weatherIcon);


                    currentWeatherDisplay.append(temp);
                    currentWeatherDisplay.append(wind);
                    currentWeatherDisplay.append(humidity);
                    currentWeatherDisplay.append(uvIndex);

                    //Clear the 5 Day Forecast
                    if (fiveDayForecast.find('.card').length > 0) {

                        while (fiveDayForecast.find('.card').length > 0) {

                            fiveDayForecast.find('.card').remove();
                        }
                    }

                    //Render HTML elements
                    fiveDayForcastHeader.text('Five Day Forecast:')


                    for (let i = 1; i < 6; i++) {
                        var day = $('<div>');
                        day.addClass('card');
                    

                        var date = $('<h3>');
                        date.text(DateTime.fromSeconds(cityData.daily[i].dt).toLocaleString());
                        day.append(date);

                        var weatherIcon = $('<img>');
                        weatherIcon.attr('alt', cityData.daily[i].weather[0].description);
                        weatherIcon.attr('src', "http://openweathermap.org/img/wn/"
                            + cityData.daily[i].weather[0].icon + "@2x.png");
                        day.append(weatherIcon);

                        var temp = $('<h4>')
                        temp.text("Temp: " + cityData.daily[i].temp.day + " °F");
                        temp.attr('class', 'forecasted-weather');
                        day.append(temp);

                        var wind = $('<h4>')
                        wind.text("Wind: " + cityData.daily[i].wind_speed + " MPH");
                        wind.attr('class', 'forecasted-weather');
                        day.append(wind);

                        var humidity = $('<h4>')
                        humidity.text("Humidity: " + cityData.daily[i].humidity + "%");
                        humidity.attr('class', 'forecasted-weather');
                        day.append(humidity);

                        fiveDayForecast.append(day);
                    }

                    //Append search history button

                    //Clear search history buttons
                    searchWindow.find('button').remove();

                    var searchHistoryButton = $('<button>');
                    searchHistoryButton.text(cityName.toUpperCase());
                    searchHistoryButton.css('margin-bottom', '10px');

                    //Check for a duplicate button
                    var isDuplicate = false;
                    for (let i = 0; i < searchHistoryButtons.length; i++) {
                        if (searchHistoryButtons[i].text() == searchHistoryButton.text()) {
                            isDuplicate = true;
                        }
                    }

                    if (isDuplicate === false) {
                        //Only allow a total of ten search history buttons
                        if (searchHistoryButtons.length < 10) {
                            searchHistoryButtons.unshift(searchHistoryButton);
                        }
                        else {
                            searchHistoryButtons.pop();
                            searchHistoryButtons.unshift(searchHistoryButton);
                        }
                    }

                    searchWindow.append(searchHistoryButtons);

                    //Save searched cities to local storage
                    var cityNames = [];
                    for(let i=0; i < searchHistoryButtons.length; i++){
                        cityNames.unshift(searchHistoryButtons[i].text());
                    }

                    localStorage.setItem('searchedCities', cityNames);
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

//Render previous searches
function renderPreviousSearches(){
  if (localStorage.getItem('searchedCities') == null){
      return;
  }

    var cityNames = localStorage.getItem('searchedCities');
    cityNames = cityNames.split(',');

    //Mem. write fxn to handle button creation
    for(let i=0; i < cityNames.length; i++){
        var searchHistoryButton = $('<button>');
        searchHistoryButton.text(cityNames[i]);
        searchHistoryButton.css('margin-bottom', '10px');
        searchHistoryButtons.unshift(searchHistoryButton);

        searchWindow.append(searchHistoryButtons);
    }
}

renderPreviousSearches();

$(searchButton).on('click', handleWeatherSearch);
$(searchWindow).on('click', 'button', handleWeatherSearch);