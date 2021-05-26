const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=72dd152039b48676084cc1b50d0e13ad&query=" +
    longitude +
    "," +
    latitude +
    "&units=f";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service.");
    } else if (body.error) {
      callback(body.error.info);
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          ". The current temperature is " +
          body.current.temperature +
          " degrees. It feels like " +
          body.current.feelslike +
          " degrees. The humidity is " +
          body.current.humidity +
          " percent. Wind speed is " +
          body.current.wind_speed +
          " mph."
      );
    }
  });
};

module.exports = forecast;
