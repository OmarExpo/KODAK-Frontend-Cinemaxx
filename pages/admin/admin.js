import utils from "./../../utils.js";

export default () => {
	const div1Element = document.querySelector(".div1");
	const div2Element = document.querySelector(".div2");
	const div3Element = document.querySelector(".div3");
	const admin_header = document.querySelector(".admin_head");
	const show_movie_btn = document.querySelector("#show_all_movies");
	const add_movies_btn = document.querySelector("#add_movies");
	const movie_para_element = document.querySelector(".movie_para");
	const signOutButton = document.querySelector("#sign-out");
	const login_nav_obj = document.querySelector("#loginLink");
	if ("username" in localStorage) {
		login_nav_obj.innerHTML = localStorage["username"] + " Logout";
	} else {
		login_nav_obj.innerHTML = "Signin Or Register";
	}

	signOutButton.addEventListener("click", () => {
		utils.logout(window.auth);
	});

	show_first_div();
	show_movie_btn.addEventListener("click", () => {
		fetch("http://3.90.205.148/movies")
			.then((response) => response.json())
			.then((movieObject) => {
				show_second_div();
				movieObject.forEach((new_movie) => {
					get_image_url_by_movie_name(new_movie);
				});
			});
	});

	add_movies_btn.addEventListener("click", () => {
		show_third_div();

		const charactersList = document.getElementById("charactersList");
		const searchBar = document.querySelector(".movie_title");
		let hpCharacters = [];

		const loadCharacters = () => {
			const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=04db70555a543ca38f42b004ffad2941&language=en-US&page=1+1`;
			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					hpCharacters = data.results;
					displayCharacters(hpCharacters);
					searchBar.addEventListener("keyup", (e) => {
						const searchString = e.target.value.toLowerCase();
						//console.log(hpCharacters);
						const filteredCharacters = hpCharacters.filter((character) => {
							return character.original_title
								.toLowerCase()
								.includes(searchString);
						});
						displayCharacters(filteredCharacters);
					});
				})
				.catch((error) => {
					console.log(error);
				});
		};
		const butttonArray = [];
		const displayCharacters = (characters) => {
			characters.map((character) => {
				const btnElement = document.createElement("button");
				btnElement.innerText = character.original_title;
				butttonArray.push(btnElement);
				charactersList.appendChild(btnElement);
			});

			butttonArray.forEach((btn) => {
				btn.addEventListener("click", () => {
					searchBar.value = btn.innerText;
				});
			});
		};
		loadCharacters();
	});

	function add_movie(movieData) {
		fetch("http://3.90.205.148/movies/addmovie", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(movieData),
		})
			.then((response) => response.json())
			.then((movieData) => {
				console.log("Success:", movieData);
				alert("Added successfully");
				location.reload();
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
	function show_first_div() {
		admin_header.innerHTML = "Welcome to Admin page.";
		div1Element.style.display = "block";
		div2Element.style.display = "none";
		div3Element.style.display = "none";
	}
	function show_second_div() {
		div1Element.style.display = "none";
		div2Element.style.display = "block";
		div3Element.style.display = "none";
	}
	function show_third_div() {
		div1Element.style.display = "none";
		div2Element.style.display = "none";
		div3Element.style.display = "block";
	}

	function get_image_url_by_movie_name(new_movie) {
		return fetch(
			`https://api.themoviedb.org/3/search/movie?api_key=eacfeabd8e111e3bea6edaa3358907aa&query=${new_movie.title}`
		)
			.then((response) => response.json())
			.then((movieObject) => {
				const movie_posterurl = movieObject.results[0].poster_path;
				const movie_story = movieObject.results[0].overview;
				const movie_submit_btn = document.querySelector("#submit");

				movie_submit_btn.addEventListener("click", () => {
					const title = movieObject.original_title;
					const age_group = "Adult";
					const actor = "actor1, actor2";
					const story = movieObject.overview;
					const rating1 = movieObject.vote_average;
					const posterLink = movieObject.poster_path;
					const movie_details = {
						title: title,
						ageGroup: age_group,
						actor: actor,
						story: story,
						rating: rating1,
						posterLink: posterLink,
					};
					add_movie(movie_details);
					location.reload();
				});

				fetch(`https://image.tmdb.org/t/p/w500/${movie_posterurl}`)
					.then((response) => response.blob())
					.then((movieObject) => {
						var objectURL = URL.createObjectURL(movieObject);
						const brElement = document.createElement("br");
						const hrElement = document.createElement("hr");
						const movie_title = document.createElement("h1");
						const movie_id_element = document.createElement("h3");
						const movie_story_label = document.createElement("label");
						const movie_story_element = document.createElement("p");
						movie_id_element.innerHTML = "Movie id:- " + new_movie.id;
						movie_title.innerHTML = "Title:- " + new_movie.title;
						movie_story_label.innerHTML = "Story:-";
						movie_story_element.innerHTML = movie_story;
						movie_para_element.appendChild(movie_id_element);
						movie_para_element.appendChild(movie_title);
						movie_para_element.appendChild(brElement);
						const movie_img_element = document.createElement("img");
						movie_img_element.setAttribute("src", `${objectURL}`);
						movie_img_element.style.width = "300px";
						movie_img_element.style.height = "300px";
						movie_para_element.appendChild(movie_img_element);
						movie_para_element.appendChild(brElement);
						movie_para_element.appendChild(movie_story_label);
						movie_para_element.appendChild(movie_story_element);
						movie_para_element.appendChild(hrElement);
						showMovieObject(movieObject);
					});
			});
	}

	function showMovieObject(anyObj) {
		console.log(anyObj);
	}

	const movie_submit_btn = document.querySelector("#submit");
	movie_submit_btn.addEventListener("click", () => {
		const movie_title_input = document.querySelector(".movie_title").value;
		fetch(
			`https://api.themoviedb.org/3/search/movie?api_key=eacfeabd8e111e3bea6edaa3358907aa&query=${movie_title_input}`
		)
			.then((response) => response.json())
			.then((movieObject) => {
				console.log(movieObject);
				const movie_posterurl = movieObject.results[0].poster_path;
				const movie_story = movieObject.results[0].overview;
				const title = movieObject.results[0].original_title;
				const age_group = "Adult";
				const actor = "actor1, actor2";
				const rating2 = `${movieObject.results[0].vote_average}` + "/10";
				const posterLink = movieObject.poster_path;
				const movie_details = {
					title: title,
					ageGroup: age_group,
					actor: actor,
					story: movie_story,
					rating: rating2,
					posterLink: movie_posterurl,
				};
				add_movie(movie_details);
			});
	});
};
