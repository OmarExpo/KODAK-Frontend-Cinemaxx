export default () => {
  const displayDiv = document.querySelector(".timeslots");
  //const mainContentCard = document.querySelector("#main-content-card");
  const timeslotsCard = document.querySelector("#timeslots-card");
  const hallsCard = document.querySelector("#halls-card");
  const movieDisplayCard = document.querySelector("#movie-display-card");
  const availSeatsCard = document.querySelector("#available-seats-card");
  const movieDiv = document.querySelector("#movie-div");
  const login_nav_obj = document.querySelector("#loginLink");
  const headerTag_element = document.querySelector(".headder_tag");

  // user
  "username" in localStorage
    ? (login_nav_obj.innerHTML = localStorage["username"] + " Logout")
    : (login_nav_obj.innerHTML = "Signin Or Register");
  let user_id = 0;
  get_userid_by_email(localStorage.username);

  // variable initialization
  let movieid = 1,
    moviename = "",
    selected_seat = 0,
    selectedDate = "",
    selectedSlot = "",
    selectedHall = "",
    buttonArray = [],
    slotButtonArray = [],
    hallButtonArray = [];

  function mapBackgroundColor(array, color) {
    array.map((item) => {
      item.style.backgroundColor = color;
    });
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
        mapBackgroundColor(buttonArray, "white");
        event.target.style.backgroundColor = "blue";
        timeslotsCard.style.display = "block";
      });
    });
  })();

  // slot buttons
  (function renderSlotButtons() {
    slotButtonArray = Array.from(
      document.getElementsByClassName("timeslot-button")
    );

    slotButtonArray.forEach((slot) => {
      slot.addEventListener("click", (event) => {
        selectedSlot = slot.innerText;
        mapBackgroundColor(slotButtonArray, "white");
        event.target.style.backgroundColor = "blue";
        timeslotsCard.style.display = "block";
        hallsCard.style.display = "block";
      });
    });
  })();

  // hall buttons
  hallButtonArray = Array.from(document.getElementsByClassName("hall-button"));

  hallButtonArray.forEach((hall) => {
    hall.addEventListener("click", (event) => {
      mapBackgroundColor(hallButtonArray, "white");
      event.target.style.backgroundColor = "blue";
      selectedHall = hall.id;
    });
  });

  // show movie button
  let showMovieButton = document.getElementById("show-button");
  showMovieButton.addEventListener("click", function () {
    movieDisplayCard.style.display = "block";
    fetchAndRenderMovie(selectedDate, selectedSlot, selectedHall);
  });

  function fetchAndRenderMovie(date, slot, hall) {
    movieDiv.innerHTML = "";
    const scheduleAPIurl = `http://3.90.205.148/schedules/${date}/${slot}/${hall}`;
    fetch(scheduleAPIurl)
      .then((response) => response.json())
      .then((scheduleData) => {
        console.log(scheduleData);
        movieid = scheduleData[0].movieId ? scheduleData[0].movieId : movieid;
        const singleMovieAPIurl = `http://3.90.205.148/movies/${movieid}`;
        fetch(singleMovieAPIurl)
          .then((response) => response.json())
          .then((movieData) => {
            console.log(movieData[0]);
            moviename = movieData[0].title;
            const movieTitleobj = document.createElement("h1");
            movieTitleobj.innerHTML = movieData[0].title;
            const buttonFreeSeats = document.createElement("button");
            buttonFreeSeats.innerText = "show free seats";
            const descriptionObject = document.createElement("P");
            descriptionObject.innerHTML = movieData[0].story;
            movieDiv.appendChild(movieTitleobj);
            get_image_url_by_movie_name(moviename, movieDiv);
            movieDiv.appendChild(descriptionObject);
            let freeSeatsButton = document.createElement("button");
            freeSeatsButton.innerHTML = "see free seats";
            movieDiv.appendChild(freeSeatsButton);

            freeSeatsButton.addEventListener("click", () => {
              availSeatsCard.style.display = "block";
              const apiUrl3 = `http://3.90.205.148/bookings/freeseats/${date}/${hall}/${slot}`;
              createSeatsArrayFromApi(16, apiUrl3);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }

  ///-------------------------------------------------------------------
  let freeseats_button_array = [];

  function createSeatsArrayFromApi(totalSeats, apistring) {
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
                const api4 = `http://3.90.205.148/bookings/${selectedDate}/${moviename}/${selectedHall}/${selectedSlot}/${user_id}/${btn.innerText}`;
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

  //------------------------------------------------------------------------------Getting userid from api using email-------------------------------------------------------
  function get_userid_by_email(useremail) {
    const api_for_id_toget_user = `http://3.90.205.148/users/${useremail}`;
    fetch(api_for_id_toget_user)
      .then((response) => response.json())
      .then((userData) => {
        user_id = userData.id;
      });
  }

  //--------------------------------fetching poster_url from api---------------------------
  function get_image_url_by_movie_name(movie_name, elementToattach) {
    return fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=eacfeabd8e111e3bea6edaa3358907aa&query=${movie_name}`
    )
      .then((response) => response.json())
      .then((movieObject) => {
        const movieImgSrc = `https://image.tmdb.org/t/p/w500/${movieObject.results[0].poster_path}`;
        const moviePosterElement = document.createElement("img");
        moviePosterElement.setAttribute("src", movieImgSrc);
        moviePosterElement.style.minWidth = "200px";
        elementToattach.appendChild(moviePosterElement);
      });
  }
};
