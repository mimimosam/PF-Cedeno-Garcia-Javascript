
// Declaring variables
let lon = config.longitude;
let lat = config.latitude;
let api = config.config;
let temperature = document.querySelector(".temp");
const kelvin = 273;

window.addEventListener("load", () => {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( (position) => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;

        // API URL
        const base =
            'http://api.openweathermap.org/data/2.5/weather?lat' + lat + '=&lon' + lon + '=&appid=' + api;

        // Calling the API
        fetch(base)
            .then((response) => {
            return response.json();
        })
            .then((data) => {
            console.log(data);
            temperature.textContent = 
                Math.floor(data.main.temp - kelvin) + "°C";
        });
    });
    }
});