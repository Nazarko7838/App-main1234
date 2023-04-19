window.onload = (event) => {

//    const routes = [
//        {path: '/App-main1234', handler: homeHandler},
//        {path: '/App-main1234/index.html', handler: homeHandler},
//        {path: '/App-main1234/login.html', handler: loginHandler},
//        {path: '/App-main1234/signup.html', handler: signupHandler}
//    ]
    const routes = [
        {path: '/', handler: homeHandler},
        {path: '/index.html', handler: homeHandler},
        {path: '/login.html', handler: loginHandler},
        {path: '/signup.html', handler: signupHandler}
    ]

    handleUrlChange();

       /* function getWeather() {
  const apiKey = "f16d97d665913ed7c12d1c39e2ac53de";
  const city = "КИЇВ";
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weatherWidget = document.getElementById("weather-widget");
      const temperature = data.main.temp;
      const description = data.weather[0].description;
      weatherWidget.innerHTML = `Температура в ${city}: ${temperature}°C. ${description}.`;
    })
    .catch((error) => {
      console.error("Помилка при отриманні погодніх даних: ", error);
    });
}

getWeather();*/


    function handleUrlChange () {
        const path = window.location.pathname;
        const urlPath = routes.find(route => route.path === path)

        if (urlPath) {
            urlPath.handler();

        } else {
            homeHandler();
        }
    }

    function homeHandler () {
        const eventForm = document.getElementById("event-form");
        const urlAddEvent = 'http://127.0.0.1:5000/create_event';
        const date = new Date().toISOString().slice(0,10);

        getEventsByDate(date)
        .then(data => showEvents(data))
        logout();
        eventForm.addEventListener("submit", (event) => {
            event.preventDefault();
            console.log(event)
            console.log(eventForm)
            sendRequestToServer(eventForm, urlAddEvent);
    })}

    function loginHandler () {
//        console.log("login")
        const loginForm = document.getElementById("login-form");
        const urlLogin = 'http://127.0.0.1:5000/login';
//        console.log(loginForm)
        const date = new Date().toISOString().slice(0,10);
        getEventsByDate(date)
        .then(data => showEvents(data))


        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
//            console.log(event)

            sendRequestToServer(loginForm, urlLogin)
            .then(response => {
            console.log(response)
                if (response.isLogged) {
                    location.replace("/index.html")
                    localStorage.setItem("token", response.token);
                    console.log(localStorage.getItem("token"));
                }
            });
    })

    }

    function signupHandler () {
        const signupForm = document.getElementById("signup-form");
        const urlSignup = 'http://127.0.0.1:5000/signup';
        console.log("Signup")

        const date = new Date().toISOString().slice(0,10);
        getEventsByDate(date)
        .then(data => showEvents(data))

        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            console.log(event)

            sendRequestToServer(signupForm, urlSignup)
            .then(response => {
                if (response.isRegistered) {
                    location.replace("/login.html")
                }
            });
    })
    }



    function getEventsByDate (date) {
        const apiUrlGet = `http://127.0.0.1:5000/get_events_by_date/${date}`;

        return fetch(apiUrlGet, {
            method: "GET",})
          .then(response => response.json())

          .catch(error => {
            console.error('Помилка:', error);
          });
    }

    const signupForm = document.getElementById("signup-form");

    function sendRequestToServer (form, url) {

        const formData = new FormData(form);
        const data = {};

        for (const[key, value] of formData.entries()) {
            data[key] = value;
        }

        return fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .catch(error => console.error('Помилка:', error));
    }

    function logout() {
        const btn = document.getElementById("logoutButton");
        btn.addEventListener("click", (event) => {
            localStorage.removeItem("token");
            location.replace("login.html")
        })
    }


    function showEvents (data) {

        const eventsDiv = document.getElementById("display-events");



        const singleDayEvents = createElementAndAppendChild("div", null, eventsDiv)
        singleDayEvents.classList.add("single-day-events");

        const date = JSON.parse(data[0]).date;
        console.log(date)

        if (date) {
            createElementAndAppendChild("h4", date,singleDayEvents)
        }

        data.forEach( (event) => {
            event = JSON.parse(event)

            const singleEvent = createElementAndAppendChild("div", null, singleDayEvents);

            createElementAndAppendChild("h3", event.header, singleEvent);

            createElementAndAppendChild("h4", event.time, singleEvent);

            createElementAndAppendChild("span", event.description, singleEvent);
        })
    }


    function createElementAndAppendChild (tagName, content, tagAddTo){
        const createdElement = document.createElement(tagName);
        if ( content ) { createdElement.textContent = content };
        tagAddTo.appendChild(createdElement);
        return createdElement
    }

    function renderEventsForFiveDays () {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 5);
        let currentDate = new Date();

        while (currentDate <= endDate) {
            const date = currentDate.toISOString();

            getEventsByDate(date)
            .then(data => showEvents(data))

            currentDate.setDate(currentDate.getDate() + 1)
        }
    }







function weatherBalloon() {
  fetch('https://api.openweathermap.org/data/2.5/weather?id=692372&appid=bed3513317b5941bc39dee432c733352&unit=metric&lang=ua')
  .then(function(resp) { return resp.json() }) // Convert data to json
  .then(function(data) {
    drawWeather(data);
  })
  .catch(function() {
    // catch any errors
  });


}

  weatherBalloon();



function drawWeather( d ) {
	var celcius = Math.round(parseFloat(d.main.temp)-273.15);
	var fahrenheit = Math.round(((parseFloat(d.main.temp)-273.15)*1.8)+32);
	document.getElementById('weather-description').innerHTML = d.weather[0].description;
	document.getElementById('temp').innerHTML = celcius + '&deg;';
	document.getElementById('location').innerHTML = d.name;
}
}