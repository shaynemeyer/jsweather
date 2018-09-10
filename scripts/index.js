// UI Elements Module
// - this module will be responsible for controlling UI Elements like 'menu'
const UI = (function() {
  let menu = document.querySelector('#menu-container');
  const showApp = () => {
    document.querySelector('#app-loader').classList.add('display-none');
    document.querySelector('main').removeAttribute('hidden');
  };

  const loadApp = () => {
    document.querySelector('#app-loader').classList.remove('display-none');
    document.querySelector('main').setAttribute('hidden', 'true');
  };

  const _showMenu = () => menu.style.right = 0;
  const _hideMenu = () => menu.style.right = '-65%';

  // menu events
  document.querySelector('#open-menu-btn').addEventListener('click', _showMenu);
  document.querySelector('#close-menu-btn').addEventListener('click', _hideMenu);

  const _toggleHourlyWeather = () => {
    let hourlyWeather = document.querySelector('#hourly-weather-wrapper');
    let arrow = document.querySelector('#toggle-hourly-weather').children[0];
    let visible = hourlyWeather.getAttribute('visible');
    let dailyWeather = document.querySelector('#daily-weather-wrapper');

    if(visible == 'false') {
      hourlyWeather.setAttribute('visible', 'true');
      hourlyWeather.style.bottom = 0;
      arrow.style.transform = 'rotate(180deg)';
      dailyWeather.style.opacity = 0;
    } else if(visible == 'true') {
      hourlyWeather.setAttribute('visible', 'false');
      hourlyWeather.style.bottom = '-100%';
      arrow.style.transform = 'rotate(0deg)';
      dailyWeather.style.opacity = 1;
    } else {
      console.error('Unknown state of the hourly weather panel and visible attribute'); 
    }
  };

  // hourly weather wrapper event
  document.querySelector('#toggle-hourly-weather').addEventListener('click', _toggleHourlyWeather);

  return {
    showApp,
    loadApp
  }
})();

// Get location module
// - gets data about the location to search for weather
const GETLOCATION = (function() {
  let location;
  const locationInput = document.querySelector('#location-input');
  const addCityBtn = document.querySelector('#add-city-btn');

  const _addCity = () => {
    location = locationInput.value;
    locationInput.value = '';
    _disableAddCityBtn();

    // get weather data
    console.log('Get weather data for', location);
  };

  const _disableAddCityBtn = () => {
    addCityBtn.setAttribute('disabled', 'true');
    addCityBtn.classList.add('disabled');
  };

  locationInput.addEventListener('input', function() {
    let inputText = this.value.trim();

    if(inputText != '') {
      addCityBtn.removeAttribute('disabled');
      addCityBtn.classList.remove('disabled');
    } else {
      _disableAddCityBtn();
    }
  })

  addCityBtn.addEventListener('click', _addCity);

})();

// Init
window.onload = function() {
  UI.showApp();
}