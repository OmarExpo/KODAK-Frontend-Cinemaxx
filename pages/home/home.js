export default () => {
	const displayDiv = document.querySelector(".timeslots");
	const div1object = document.querySelector("#div1");
	const div2object = document.querySelector("#div2");
	const div3object = document.querySelector("#div3");
	const div4object = document.querySelector("#div4");
	const div5object = document.querySelector("#div5");
	const login_nav_obj = document.querySelector("#loginLink");
	const headerTag_element = document.querySelector(".headder_tag");

	if ("username" in localStorage) {
		login_nav_obj.innerHTML = localStorage["username"];
	} else {
		login_nav_obj.innerHTML = "Signin Or Register";
	}

	let today = new Date();
	let nextday = new Date();
	let freeseats_button_array = [];

	let day = new Date().getDate();
	let month = today.getMonth();
	let movieid = 0;
	let moviename = "";
	let selected_seat = 0;

	let user_id = 0;

	get_userid_by_email(localStorage.username);

	let selectedDate = "";
	let selectedSlot = "";
	let selectedHall = "";
	let buttonArray = [];
	let slotButtonArray = [];
	let hallButtonArray = [];
	for (let i = 1; i <= 7; i++) {
		if (day <= 9 || month <= 9) {
			day = "0" + day;
			month = "0" + month;
		}

		let btn = document.createElement("button");
		let innertextValue =
			nextday.getFullYear() + "-" + (nextday.getMonth() + 1) + "-" + day;
		btn.innerText = innertextValue;
		displayDiv.appendChild(btn);
		btn.setAttribute("class", "buttonClass");

		nextday.setDate(today.getDate() + i);

		day = nextday.getDate();
		buttonArray.push(btn);
	}
	console.log(buttonArray);
	//let clickedBtn = document.querySelector(".buttonClass");
	buttonArray.forEach((btn) => {
		btn.addEventListener("click", () => {
			selectedDate = btn.innerText;
			console.log(selectedDate);
			displaySlots();
		});
	});

	function displaySlots() {
		div1object.style.display = "none";
		div2object.style.display = "block";
		div3object.style.display = "none";
		div4object.style.display = "none";
		div5object.style.display = "none";
	}
	function displayHalls() {
		div1object.style.display = "none";
		div2object.style.display = "none";
		div3object.style.display = "block";
		div4object.style.display = "none";
		div5object.style.display = "none";
	}
	function displayMovies() {
		div1object.style.display = "none";
		div2object.style.display = "none";
		div3object.style.display = "none";
		div4object.style.display = "block";
		div5object.style.display = "none";
	}
	function displaySeats() {
		div1object.style.display = "none";
		div2object.style.display = "none";
		div3object.style.display = "none";
		div4object.style.display = "none";
		div5object.style.display = "block";
	}
	const moringButtonObject = document.querySelector("#morning");
	slotButtonArray.push(moringButtonObject);
	const afternoonButtonObject = document.querySelector("#afternoon");
	slotButtonArray.push(afternoonButtonObject);
	const eveningButtonObject = document.querySelector("#evening");
	slotButtonArray.push(eveningButtonObject);
	console.log(slotButtonArray);

	slotButtonArray.forEach((slot) => {
		slot.addEventListener("click", () => {
			selectedSlot = slot.innerText;
			displayHalls();
		});
	});
	const hallbuttonAobject = document.querySelector("#A");
	hallButtonArray.push(hallbuttonAobject);
	const hallbuttonBobject = document.querySelector("#B");
	hallButtonArray.push(hallbuttonBobject);
	const hallbuttonCobject = document.querySelector("#C");
	hallButtonArray.push(hallbuttonCobject);
	hallButtonArray.forEach((hall) => {
		hall.addEventListener("click", () => {
			selectedHall = hall.id;
			displayMovies();

			const movieDisplayUlObj = document.querySelector(".movieDisplayClass");
			const apiUrl = `http://3.90.205.148/schedules/${selectedDate}/${selectedSlot}/${selectedHall}`;
			fetch(apiUrl)
				.then((response) => response.json())
				.then((scheduleData) => {
					movieid = scheduleData[0].movieId;
					const apiUrl1 = `http://3.90.205.148/movies/${movieid}`;
					fetch(apiUrl1)
						.then((response) => response.json())
						.then((movieData) => {
							moviename = movieData[0].title;
							const movieTitleobj = document.createElement("h1");
							movieTitleobj.innerHTML = movieData[0].title;
							const buttonFreeSeats = document.createElement("button");
							buttonFreeSeats.innerText = "show free seats";
							const descriptionObject = document.createElement("P");
							descriptionObject.innerHTML = movieData[0].story;
							movieDisplayUlObj.appendChild(movieTitleobj);
							get_image_url_by_movie_name(moviename, movieDisplayUlObj);
							movieDisplayUlObj.appendChild(descriptionObject);
							const free_seats_buttonobj =
								document.querySelector("#seatdisplay");
							const cardBodyobj = document.querySelector(".showseats");
							free_seats_buttonobj.addEventListener("click", () => {
								displaySeats();
								const apiUrl3 = `http://3.90.205.148/bookings/freeseats/${selectedDate}/${selectedHall}/${selectedSlot}`;
								createSeatsArrayFromApi(16, apiUrl3);
							});
						})
						.catch((error) => {
							console.log(error);
						})
						.catch((error) => {
							console.log(error);
						});
				});
		});
	});

	///-------------------------------------------------------------------

	function createSeatsArrayFromApi(totalSeats, apistring) {
		let freeseats = [];
		for (let i = 1; i <= totalSeats; i++) {
			freeseats.push(i);
		}
		//console.log(freeseats);
		const trElement = document.querySelector(".tr");
		let counter = 0;
		fetch(apistring)
			.then((response) => response.json())
			.then((seatsData) => {
				console.log(seatsData);
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
						console.log(user_id);

						if (typeof localStorage.username !== "undefined") {
							const connformation = confirm(
								"Do you want to reserve seat number:- " + btn.innerText + "?"
							);
							if (connformation) {
								const api4 = `http://3.90.205.148/bookings/${selectedDate}/${moviename}/${selectedHall}/${selectedSlot}/${user_id}/${btn.innerText}`;
								fetch(api4)
									.then((response) => response.json())
									.then((reserved_seat) => {
										console.log(typeof reserved_seat);
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
				const movie_posterurl = movieObject.results[0].poster_path;

				fetch(`https://image.tmdb.org/t/p/w500/${movie_posterurl}`)
					.then((response) => response.blob())
					.then((movieObject) => {
						var objectURL = URL.createObjectURL(movieObject);

						const movie_img_element = document.createElement("img");
						movie_img_element.setAttribute("src", `${objectURL}`);
						movie_img_element.style.width = "300px";
						movie_img_element.style.height = "300px";
						elementToattach.appendChild(movie_img_element);
					});
			});
	}
};
