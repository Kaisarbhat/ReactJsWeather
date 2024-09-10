import { useState,useEffect } from "react";
import Search from "./components/Search/Search";
import CurrentWeather from "./components/current-weather/CurrentWeather";
import Forecast from "./components/forecast/Forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";
import { images } from "./images";



function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [background , setBackground] = useState(null)

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forcastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forcastResponse });
        setBackgroundBasedOnWeather(weatherResponse.weather[0].description);
        //console.log(weatherResponse.weather[0].description);
        
      })
      .catch(console.log);
  };
  const setBackgroundBasedOnWeather = (description) => {
    let backgroundImage = images.Clear; // Default background

    for (const [key, value] of Object.entries(images)) {
      if (description === key ) {
        backgroundImage = value;
        break;
      }
    }

    setBackground(backgroundImage);
    console.log(backgroundImage);
    
  }; 
  useEffect(() => {
    if (currentWeather) {
      console.log('here');
      
      setBackgroundBasedOnWeather(currentWeather.weather[0].description);
      console.log(currentWeather.weather[0].description);
      
    }
  }, [currentWeather]);



  return (
    <div className="container" style={{ 
    backgroundImage: `url(${background})` ,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'}}>
      <Search onSearchChange={handleOnSearchChange}/>
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
