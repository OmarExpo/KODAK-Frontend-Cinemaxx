import utils from "./../../utils.js";

export default (auth) => {
	fetch("http://3.90.205.148/schedules/week")
		.then((response) => response.json())
		.then((scheduleDetails) => {
			console.log(scheduleDetails);
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
						const brElement = document.createElement("br");
						let count = 0;

						fetch(`https://image.tmdb.org/t/p/w500/${posterPath}`)
							.then((response) => response.blob())
							.then((moviePicture) => {
								var objectURL = URL.createObjectURL(moviePicture);
								const movie_img_element = document.createElement("img");
								movie_img_element.setAttribute("src", `${objectURL}`);
								movie_img_element.style.width = "300px";
								movie_img_element.style.height = "300px";

								scheduleDetailElement.appendChild(cardBodyElement);
								scheduleDetailElement.style.marginLeft = "30%";
								scheduleDetailElement.style.display = "block";

								cardBodyElement.setAttribute("className", "card");
								cardBodyElement.style.border = "1px solid black";
								cardBodyElement.style.textAlign = "center";
								cardBodyElement.style.backgroundColor = "cyan";
								cardBodyElement.style.width = "80%";
								cardBodyElement.style.padding = "5%";

								headingTagElement.innerHTML = movieTitle;
								dateElement.innerHTML = "Date: " + showDate;
								hallElement.innerHTML = "Hall: " + showHallName;
								slotElement.innerHTML = "Time: " + showSlotName;

								cardBodyElement.append(
									headingTagElement,
									movie_img_element,
									dateElement,
									hallElement,
									slotElement,
									brElement
								);
							});
					});
			});
		});
};
