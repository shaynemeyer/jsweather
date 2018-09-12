// /**************************************************
// **
// ** UI Elements Module
// **
// ** - this module will be responsible for controlling UI Elements like 'menu'
// **
// /**************************************************
const UI = (function () {
    let menu = document.querySelector('#menu-container');
    const showApp = () => {
        document.querySelector('#app-loader').classList.add('display-none');
        document.querySelector('main').removeAttribute('hidden');
    };

    const loadApp = () => {
        document.querySelector('#app-loader').classList.remove('display-none');
        document.querySelector('main').setAttribute('hidden', 'true');
    };

    const drawWeatherData = (data, location) => {
        console.log(data);
        console.log(location);

        let currentlyData = data.currently;
        let dailyData = data.daily.data;
        let hourlyData = data.hourly.data;
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let dailyWeatherWrapper = document.querySelector('#daily-weather-wrapper');
        let dailyWeatherModel, day, maxMinTemp, dailyIcon;

        let hourlyWeatherWrapper = document.querySelector('#hourly-weather-wrapper');
        let hourlyWeatherModel, hourlyIcon;

        document.querySelectorAll('.location-label').forEach((e) => {
            e.innerHTML = location;
        });

        // set background image
        document.querySelector('main').style.backgroundImage = `url("./assets/images/bg-images/${currentlyData.icon}.jpg")`;
        // set the icon
        document.querySelector('#currently-icon').setAttribute('src', `./assets/images/summary-icons/${currentlyData.icon}-white.png`);
        // set summary
        document.querySelector('#summary-label').innerHTML = currentlyData.summary;
        // set temperature from
        document.querySelector('#degrees-label').innerHTML = Math.round(currentlyData.temperature) + '&#176;';
        // set humidity
        document.querySelector('#humidity-label').innerHTML = Math.round(currentlyData.humidity * 100) + '%';
        // set wind speed
        document.querySelector('#wind-speed-label').innerHTML = (currentlyData.windSpeed).toFixed(1) + 'mph';

        // set daily weather
        while (dailyWeatherWrapper.children[1]) {
            dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1]);
        }

        for (let i = 0; i <= 6; i++) {
            // clone the node and remove display none class
            dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
            dailyWeatherModel.classList.remove('display-none');

            // set the day
            day = weekDays[new Date(dailyData[i].time * 1000).getDay()];
            dailyWeatherModel.children[0].children[0].innerHTML = day;

            // set min/max temp for the next days
            maxMinTemp = Math.round(dailyData[i].temperatureMax) + '&#176;' + '/' + Math.round(dailyData[i].temperatureMin) + '&#176;';
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;

            // set daily icon
            dailyIcon = dailyData[i].icon;
            dailyWeatherModel.children[1].children[1].children[0].setAttribute('src', `./assets/images/summary-icons/${dailyIcon}-white.png`);

            // append the model
            dailyWeatherWrapper.appendChild(dailyWeatherModel);
        }

        dailyWeatherWrapper.children[1].classList.add('current-day-of-the-week');

        // set hourly weather
        while (hourlyWeatherWrapper.children[1]) {
            hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1]);
        }

        for (let i = 0; i <= 24; i++) {
            // clone the node and remove display none class
            hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
            hourlyWeatherModel.classList.remove('display-none');

            // set hour
            hourlyWeatherModel.children[0].children[0].innerHTML = new Date(hourlyData[i].time * 1000).getHours() + ":00";

            // set temperature
            hourlyWeatherModel.children[1].children[0].innerHTML = Math.round(hourlyData[i].temperature) + '&#176;';

            // set the icon
            hourlyIcon = hourlyData[i].icon;
            hourlyWeatherModel.children[1].children[1].children[0].setAttribute('src', `./assets/images/summary-icons/${hourlyIcon}-grey.png`);

            // append model
            hourlyWeatherWrapper.appendChild(hourlyWeatherModel);
        }

        UI.showApp();
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

        if (visible == 'false') {
            hourlyWeather.setAttribute('visible', 'true');
            hourlyWeather.style.bottom = 0;
            arrow.style.transform = 'rotate(180deg)';
            dailyWeather.style.opacity = 0;
        } else if (visible == 'true') {
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
        loadApp,
        drawWeatherData
    }
})();

// /**************************************************
// **
// ** Local Storage API
// **
// ** - this module is responsible for saving, retrieving and deleting the cities added by user
// **
// /**************************************************
const LOCALSTORAGE = (function () {
    let savedCities = [];

    const save = (city) => {
        savedCities.push(city);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }

    const get = () => {
        if(localStorage.getItem('savedCities') != null) {
            savedCities = JSON.parse(localStorage.getItem('savedCities'));
        }
    }

    const remove = (index) => {
        if(index < savedCities.length) {
            savedCities.splice(index, 1);
            localStorage.setItem('savedCities', JSON.stringify(savedCities));
        }
    };

    const getSavedCities = () => savedCities;

    return {
        save,
        get,
        remove,
        getSavedCities
    }
})();

// /**************************************************
// **
// ** Saved Cities module
// **
// ** - this module will be responsible for showing the UI saved cities from localStorage
// ** and from here user will be able to delete or switch between the city he wants see data for.
// **
// /**************************************************
const SAVEDCITIES = (function () {
    let container = document.querySelector('#saved-cities-wrapper');

    const drawCity = (city) => {
        let cityBox = document.createElement('div');
        let cityWrapper = document.createElement('div');
        let deleteWrapper = document.createElement('div');
        let cityTextNode = document.createElement('h1');
        let deleteBtn = document.createElement('button');

        cityBox.classList.add('saved-city-box', 'flex-container');
        cityTextNode.innerHTML = city;
        cityTextNode.classList.add('set-city');
        cityWrapper.classList.add('ripple', 'set-city');
        cityWrapper.append(cityTextNode);
        cityBox.append(cityWrapper);

        deleteBtn.classList.add('ripple', 'remove-saved-city');
        deleteBtn.innerHTML = '-';
        deleteWrapper.append(deleteBtn);
        cityBox.append(deleteWrapper);

        container.append(cityBox);
    };

    const _deleteCity = (cityHTMLBtn) => {
        let nodes = Array.prototype.slice.call(container.children);
        let cityWrapper = cityHTMLBtn.closest('.saved-city-box');
        let cityIndex = nodes.indexOf(cityWrapper);
        LOCALSTORAGE.remove(cityIndex);
        cityWrapper.remove();
    };

    document.addEventListener('click', function (event) {
       if(event.target.classList.contains('remove-saved-city')) {
           _deleteCity(event.target);
       }
    });

    document.addEventListener('click', function (event) {
        if(event.target.classList.contains('set-city')) {
            let nodes = Array.prototype.slice.call(container.children);
            let cityWrapper = event.target.closest('.saved-city-box');
            let cityIndex = nodes.indexOf(cityWrapper);
            let savedCities = LOCALSTORAGE.getSavedCities();

            WEATHER.getWeather(savedCities[cityIndex], false);
        }
    });

    return {
        drawCity
    }
})();


// /**************************************************
// **
// ** Get location module
// **
// ** - this module gets data about the location to search for weather
// **
// /**************************************************
const GETLOCATION = (function () {
    let location;
    const locationInput = document.querySelector('#location-input');
    const addCityBtn = document.querySelector('#add-city-btn');

    const _addCity = () => {
        location = locationInput.value;
        locationInput.value = '';
        _disableAddCityBtn();

        // get weather data
        WEATHER.getWeather(location, true);
    };

    const _disableAddCityBtn = () => {
        addCityBtn.setAttribute('disabled', 'true');
        addCityBtn.classList.add('disabled');
    };

    locationInput.addEventListener('input', function () {
        let inputText = this.value.trim();

        if (inputText != '') {
            addCityBtn.removeAttribute('disabled');
            addCityBtn.classList.remove('disabled');
        } else {
            _disableAddCityBtn();
        }
    })

    addCityBtn.addEventListener('click', _addCity);

})();

// /**************************************************
// **
// ** Get Weather Data
// **
// ** - this module will aquire weather data and then pass it to another module to be used in the UI.
// **
// /**************************************************
const WEATHER = (function () {
    const {opencageapi, darkskyapi} = ENV.getVars();
    const _getGeocodeUrl = (location) => `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${opencageapi}`;

    const _getDarkskyUrl = (lat, lng) => `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkskyapi}/${lat},${lng}`;

    const _getDarkSkyData = (url, location) => {
        axios.get(url).then((res) => {
            console.log(res);
            UI.drawWeatherData(res.data, location);
        })
            .catch((err) => {
                console.log(err);
            });
    }

    const getWeather = (location, save) => {
        UI.loadApp();
        let geocodeUrl = _getGeocodeUrl(location);

        axios.get(geocodeUrl).then((res) => {
            if(res.data.results.length == 0) {
                console.error("Invalid Location");
                UI.showApp();
                return;
            }

            if(save) {
                LOCALSTORAGE.save(location);
                SAVEDCITIES.drawCity(location);
            }

            const lat = res.data.results[0].geometry.lat;
            const lng = res.data.results[0].geometry.lng;
            let darkskyURL = _getDarkskyUrl(lat, lng);

            _getDarkSkyData(darkskyURL, location);
        }).catch((err) => {
            console.log(err);
        });
    };

    return {
        getWeather
    }
})();


// Init
window.onload = function () {
    LOCALSTORAGE.get();
    let cities = LOCALSTORAGE.getSavedCities();
    if(cities.length != 0) {
        cities.forEach((city) => SAVEDCITIES.drawCity(city));
        WEATHER.getWeather(cities[cities.length -1], false);
    } else {
        UI.showApp();
    }
};

