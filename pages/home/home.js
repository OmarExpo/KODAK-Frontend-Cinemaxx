export default () => {
  const displayDiv = document.querySelector(".timeslots");
  const timeslotsCard = document.querySelector("#timeslots-card");
  const hallsCard = document.querySelector("#halls-card");
  const movieDisplayCard = document.querySelector("#movie-display-card");
  const availSeatsCard = document.querySelector("#available-seats-card");
  const movieDiv = document.querySelector("#movie-div");
  const login_nav_obj = document.querySelector("#loginLink");

  // user
  "username" in localStorage
    ? (login_nav_obj.innerHTML = localStorage["username"] + " Logout")
    : (login_nav_obj.innerHTML = "Signin Or Register");
  let user_id = 0;

  (function getUseridByEmail() {
    let userEmail = localStorage.username;
    const api_for_id_toget_user = `http://3.90.205.148/users/${userEmail}`;
    fetch(api_for_id_toget_user)
      .then((response) => response.json())
      .then((userData) => {
        user_id = userData.id;
      });
  })();

  // variable initialization
  let movieid = 1,
    selected_seat = 0,
    selectedDate = "",
    selectedSlot = "",
    selectedHall = "",
    buttonArray = [],
    slotButtonArray = [],
    hallButtonArray = [];

  function mapBackgroundColor(array, color, event) {
    array.map((item) => {
      item.style.backgroundColor = color;
    });
    event.target.style.backgroundColor = "blue";
  }

  // render buttons of schedule dates for a week from current date
  (function renderDateButtons() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;

    for (let i = 1; i <= 7; i++) {
      let dateButton = document.createElement("button");
      let constructedDate =
        date.getFullYear() +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day);
      dateButton.innerText = constructedDate;
      displayDiv.appendChild(dateButton);
      dateButton.setAttribute("class", "schedule-date-button");
      date.setDate(date.getDate() + 1);
      day = date.getDate();
      buttonArray.push(dateButton);
    }

    buttonArray.forEach((dateButton) => {
      dateButton.addEventListener("click", (event) => {
        selectedDate = dateButton.innerText;
        mapBackgroundColor(buttonArray, "white", event);
        timeslotsCard.style.display = "block";
      });
    });
  })();

  // render slot buttons
  (function renderSlotButtons() {
    slotButtonArray = Array.from(
      document.getElementsByClassName("timeslot-button")
    );
    slotButtonArray.forEach((slot) => {
      slot.addEventListener("click", (event) => {
        selectedSlot = slot.innerText;
        mapBackgroundColor(slotButtonArray, "white", event);
        timeslotsCard.style.display = "block";
        hallsCard.style.display = "block";
      });
    });
  })();

  // render hall buttons
  (function renderHallButtons() {
    hallButtonArray = Array.from(
      document.getElementsByClassName("hall-button")
    );
    hallButtonArray.forEach((hall) => {
      hall.addEventListener("click", (event) => {
        mapBackgroundColor(hallButtonArray, "white", event);
        selectedHall = hall.id;
      });
    });
  })();

  // define show movie button
  let showMovieButton = document.getElementById("show-button");
  showMovieButton.addEventListener("click", function () {
    movieDisplayCard.style.display = "block";
    fetchAndRenderMovie(selectedDate, selectedSlot, selectedHall);
  });

  // --------------------- fetch and render movie ---------------------
  function fetchAndRenderMovie(date, slot, hall) {
    movieDiv.innerHTML = "";
    const scheduleAPIurl = `http://3.90.205.148/schedules/${date}/${slot}/${hall}`;
    fetch(scheduleAPIurl)
      .then((response) => response.json())
      .then((scheduleData) => {
        movieid = scheduleData[0].movieId ? scheduleData[0].movieId : movieid;
        const singleMovieAPIurl = `http://3.90.205.148/movies/${movieid}`;
        fetch(singleMovieAPIurl)
          .then((response) => response.json())
          .then((movieData) => {
            renderMovie(movieData[0], date, slot, hall);
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }

  function renderMovie(movieData, date, slot, hall) {
    movieDiv.innerHTML = `
	 	<h1>${movieData.title ? movieData.title : "-"}</h1>
		<p>${movieData.story ? movieData.story : "-"}</p>	  `;
    renderMoviePoster(movieData.title, movieDiv);

    setTimeout(() => {
      let freeSeatsButton = document.createElement("button");
      freeSeatsButton.innerHTML = "see free seats";
      movieDiv.appendChild(freeSeatsButton);
      freeSeatsButton.addEventListener("click", () => {
        availSeatsCard.style.display = "block";
        const bookSeatURL = `http://3.90.205.148/bookings/freeseats/${date}/${hall}/${slot}`;

        createSeatsArrayFromApi(
          16,
          bookSeatURL,
          date,
          movieData.title,
          hall,
          slot,
          user_id,
          selected_seat
        );
      });
    }, 1000);
  }

  function renderMoviePoster(movie_name, elementToattach) {
    return fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=eacfeabd8e111e3bea6edaa3358907aa&query=${movie_name}`
    )
      .then((response) => response.json())
      .then((movieObject) => {
        const movieImgSrc = movieObject.results[0].poster_path
          ? `https://image.tmdb.org/t/p/w500/${movieObject.results[0].poster_path}`
          : "https://media.comicbook.com/files/img/default-movie.png";
        const moviePosterElement = document.createElement("img");
        moviePosterElement.setAttribute("src", movieImgSrc);
        moviePosterElement.style.minWidth = "200px";
        elementToattach.appendChild(moviePosterElement);
      });
  }
};

/// -------------------------- free seats display -----------------------------------------
let freeseats_button_array = [];

function createSeatsArrayFromApi(
  totalSeats,
  apistring,
  selectedDate,
  moviename,
  selectedHall,
  selectedSlot,
  user_id,
  selected_seat
) {
  const headerTag_element = document.querySelector(".headder_tag");
  let freeseats = [];
  for (let i = 1; i <= totalSeats; i++) {
    freeseats.push(i);
  }
  const trElement = document.querySelector(".tr");
  let counter = 0;
  fetch(apistring)
    .then((response) => response.json())
    .then((seatsData) => {
      seatsData.forEach((seat) => {
        for (let i = 0; i < freeseats.length; i++) {
          if (freeseats[i] === seat.seatNumber) {
            freeseats.splice(i, 1);
          }
        }

        if (counter % 4 === 0) {
          const newTd = document.createElement("td");
          const newTr = document.createElement("tr");
          const buttonObj = document.createElement("button");
          buttonObj.innerText = seat.seatNumber;
          freeseats_button_array.push(buttonObj);
          newTd.style.backgroundColor = "green";
          newTd.appendChild(buttonObj);
          trElement.appendChild(newTr);
          trElement.appendChild(newTd);
        } else {
          const newTd = document.createElement("td");
          const buttonObj = document.createElement("button");
          buttonObj.innerText = seat.seatNumber;
          freeseats_button_array.push(buttonObj);
          newTd.style.backgroundColor = "green";
          newTd.appendChild(buttonObj);
          trElement.appendChild(newTd);
        }

        counter++;
      });
      for (let i = 0; i < freeseats.length; i++) {
        const newTd = document.createElement("td");
        const buttonObj = document.createElement("button");
        buttonObj.innerText = freeseats[i];
        buttonObj.disabled = "true";
        newTd.style.backgroundColor = "red";
        newTd.appendChild(buttonObj);
        trElement.appendChild(newTd);
      }
      freeseats_button_array.forEach((btn) => {
        btn.addEventListener("click", () => {
          selected_seat = btn.innerText;

          if (typeof localStorage.username !== "undefined") {
            const connformation = confirm(
              "Do you want to reserve seat number:- " + btn.innerText + "?"
            );
            if (connformation) {
              const api4 = `http://3.90.205.148/bookings/${selectedDate}/${moviename}/${selectedHall}/${selectedSlot}/${user_id}/${selected_seat}`;
              fetch(api4)
                .then((response) => response.json())
                .then((reserved_seat) => {
                  const message_displayObj = document.querySelector(
                    ".conformation_message"
                  );
                  const messageHeader = document.createElement("h3");
                  let objectLength = Object.keys(reserved_seat).length;
                  if (objectLength > 0) {
                    messageHeader.innerHTML = `You have reserved a seat number ${selected_seat},\n
																		in hall no ${selectedHall} on ${selectedDate},${selectedSlot} show on\n
																		to see the ${moviename} . Thank you for choosing us... have a nice show.`;

                    message_displayObj.appendChild(messageHeader);
                    btn.style.backgroundColor = "blue";
                    btn.disabled = "true";
                    trElement.style.display = "none";

                    headerTag_element.innerHTML = "Your reservation datails.";
                    const print_btn = document.createElement("button");
                    print_btn.className = "print_btn";
                    print_btn.innerText = "Print";
                    message_displayObj.appendChild(print_btn);
                    print_btn.addEventListener("click", () => {
                      window.print();
                    });
                  } else {
                    messageHeader.innerHTML = `Something went wrong- it seems you tried to book multiple ticket try for the another show.`;
                    message_displayObj.appendChild(messageHeader);
                  }
                });
            }
          } else {
            alert("please login first......");
          }
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
