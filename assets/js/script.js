





//Reference HTML 
var citySearch = $("#city-search");
var searchButton = $('#search-button');


//Fetch server-side API data
function getAPI(){

    //Setup API URL
    cityName = citySearch.val();

    var openWeatherAPIkey = "204cd8bda70bb395d61013c2ab681a00";

    var openWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + cityName 
    + "&appid="
    + openWeatherAPIkey;

    fetch(openWeatherURL)

    .then(function (response){
        console.log(response.status);
        return response.json();
       
    })

    .then(function(data){
        console.log(data);
    })

    .catch( function(error){
        console.log(error);
    }
    )
}

$(searchButton).on('click', getAPI);