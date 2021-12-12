export default () => {
  fetch(`http://3.90.205.148/schedules/today`)
    .then((response) => response.json())
    .then((scheduleDetails) => {
      const scheduleDetailElement = document.querySelector(".today-movies");

      scheduleDetails.forEach((show) => {
        const movieId = show.movieId;
        const movieDate = show.date;
        const movieHall = show.hallName;
        const movieSlot = show.slotName;

        fetch(`http://3.90.205.148/movies/${movieId}`)
          .then((response) => response.json())
          .then((movieDetails) => {
            const movieTitle = movieDetails[0].title;
            const posterPath = movieDetails[0].posterLink;

            const fieldsetBySlot =
              movieSlot === "Morning"
                ? document.getElementById("morning")
                : movieSlot === "Afternoon"
                ? document.getElementById("afternoon")
                : document.getElementById("evening");
            let fieldsets = Array.from(scheduleDetailElement.children);
            fieldsets.forEach((fieldset) => {
              fieldset.style.display = "block";
            });
            const movieDiv = document.createElement("div");
            const headingTagElement = document.createElement("h3");
            const dateElement = document.createElement("p");
            const hallElement = document.createElement("p");
            const slotElement = document.createElement("p");

            const imageDiv = document.createElement("div");
            const movie_img_element = document.createElement("img");
            imageDiv.appendChild(movie_img_element);
            movie_img_element.setAttribute(
              "src",
              `https://image.tmdb.org/t/p/w500/${posterPath}`
            );

            scheduleDetailElement.appendChild(movieDiv);

            headingTagElement.innerHTML = movieTitle;
            dateElement.innerHTML = movieDate;
            hallElement.innerHTML = "Hall " + movieHall;
            slotElement.innerHTML = movieSlot;

            movieDiv.append(
              headingTagElement,
              imageDiv,
              dateElement,
              hallElement,
              slotElement
            );
            fieldsetBySlot.appendChild(movieDiv);
          });
      });
    });
};
