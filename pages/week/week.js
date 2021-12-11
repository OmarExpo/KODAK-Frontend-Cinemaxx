export default (auth) => {
  fetch("http://3.90.205.148/schedules/week")
    .then((response) => response.json())
    .then((scheduleDetails) => {
      const scheduleDetailElement = document.querySelector(".movie-details");
      scheduleDetails.forEach((show) => {
        const movieId = show.movieId;
        const showDate = show.date;
        const showHallName = show.hallName;
        const showSlotName = show.slotName;

        fetch(`http://3.90.205.148/movies/${movieId}`)
          .then((response) => response.json())
          .then((movieDetails) => {
            const movieTitle = movieDetails[0].title;
            const posterPath = movieDetails[0].posterLink;
            const cardBodyElement = document.createElement("div");
            const headingTagElement = document.createElement("h3");
            const dateElement = document.createElement("h5");
            const hallElement = document.createElement("h5");
            const slotElement = document.createElement("h5");

            fetch(`https://image.tmdb.org/t/p/w500/${posterPath}`)
              .then((response) => response.blob())
              .then((moviePicture) => {
                var objectURL = URL.createObjectURL(moviePicture);
                const imageDiv = document.createElement("div");
                cardBodyElement.appendChild(imageDiv);
                const movie_img_element = document.createElement("img");
                imageDiv.appendChild(movie_img_element);
                movie_img_element.setAttribute("src", `${objectURL}`);
                scheduleDetailElement.appendChild(cardBodyElement);

                headingTagElement.innerHTML = movieTitle;
                dateElement.innerHTML = "Date: " + showDate;
                hallElement.innerHTML = "Hall: " + showHallName;
                slotElement.innerHTML = "Time: " + showSlotName;

                cardBodyElement.append(
                  headingTagElement,
                  imageDiv,
                  dateElement,
                  hallElement,
                  slotElement
                );
              });
          });
      });
    });
};
