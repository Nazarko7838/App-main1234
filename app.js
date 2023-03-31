window.onload = (event) => {

    const routes = [
        {path: '/App-main1234', handler: homeHandler},
        {path: '/App-main1234/index.html', handler: homeHandler},
        {path: '/App-main1234/login.html', handler: loginHandler},
        {path: '/App-main1234/signup.html', handler: signupHandler}
    ]

    handleUrlChange();


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
        const loginForm = document.getElementById("login-form");
        const urlLogin = 'http://127.0.0.1:5000/login';
//        console.log(loginForm)

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

            createElementAndAppendChild("span", event.time, singleEvent);

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
}