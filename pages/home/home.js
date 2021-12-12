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
        mapBackgroundColor(buttonArray, "gray", event);
        timeslotsCard.style.display = "flex";
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
        mapBackgroundColor(slotButtonArray, "gray", event);
        timeslotsCard.style.display = "flex";
        hallsCard.style.display = "flex";
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
        mapBackgroundColor(hallButtonArray, "gray", event);
        selectedHall = hall.id;
      });
    });
  })();

  // define show movie button
  let showMovieButton = document.getElementById("show-button");
  showMovieButton.addEventListener("click", function () {
    movieDiv.style.display = "block";
    movieDisplayCard.style.display = "block";
    const seatsDiv = document.getElementById("seats-div");

    seatsDiv.innerHTML = "";
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
      freeSeatsButton.setAttribute("id", "free-seats-button");
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

  function renderMoviePoster(movie_name, parentElement) {
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
        parentElement.appendChild(moviePosterElement);
      });
  }
};

/// -------------------------- free seats display -----------------------------------------

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
  let message_displayObj = document.querySelector(".confirmation_message");
  const seatsDiv = document.getElementById("seats-div");
  seatsDiv.innerHTML = "";

  fetch(apistring)
    .then((response) => response.json())
    .then((seatsData) => {
      let freeSeatsButtonArray = [];
      let hallSeatsArray = [];
      let freeSeatsArray = [];

      // build all seats array and avail seats array to easily detect availability
      for (let i = 0; i < totalSeats; i++) {
        hallSeatsArray.push(i + 1);
      }
      for (let i = 0; i < seatsData.length; i++) {
        freeSeatsArray.push(seatsData[i].seatNumber);
      }

      hallSeatsArray.forEach((seat) => {
        const seatButton = document.createElement("button");
        seatButton.innerText = seat;
        seatsDiv.appendChild(seatButton);

        if (freeSeatsArray.includes(seat)) {
          seatButton.style.backgroundColor = "green";
        } else {
          seatButton.style.backgroundColor = "red";
          seatButton.disabled = true;
        }
        freeSeatsButtonArray.push(seatButton);
      });

      freeSeatsButtonArray.forEach((btn) => {
        btn.addEventListener("click", () => {
          selected_seat = btn.innerText;
          console.log(selected_seat);

          console.log(localStorage.username);
          if (typeof localStorage.username !== "undefined") {
            const confirmation = confirm(
              "Do you want to reserve seat number " + btn.innerText + "?"
            );
            if (confirmation) {
              console.log(confirmation);

              renderModal();
              const api4 = `http://3.90.205.148/bookings/${selectedDate}/${moviename}/${selectedHall}/${selectedSlot}/${user_id}/${selected_seat}`;
              fetch(api4)
                .then((response) => response.json())
                .then((reserved_seat) => {
                  console.log("reserved_seat", reserved_seat);
                  const messageHeader = document.createElement("h3");
                  let objectLength = Object.keys(reserved_seat).length;
                  console.log("objectLength", objectLength);
                  if (objectLength > 0) {
                    messageHeader.innerHTML = `You have reserved a seat number ${selected_seat},\n
																		in hall no ${selectedHall} on ${selectedDate},${selectedSlot} show on\n
																		to see the ${moviename} . Thank you for choosing us... have a nice show.`;

                    message_displayObj.appendChild(messageHeader);
                    btn.style.backgroundColor = "blue";
                    btn.disabled = "true";

                    seatsDiv.style.display = "none";

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

// ------- modal -------
function renderModal() {
  let message_displayObj = document.querySelector(".confirmation_message");
  message_displayObj.innerHTML = "";
  let modal = document.getElementById("myModal");
  modal.style.display = "block";
  let span = document.getElementsByClassName("close")[0];
  span.addEventListener("click", function () {
    modal.style.display = "none";
  });
}
