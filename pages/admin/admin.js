export default () => {
	const div1Element = document.querySelector(".div1");
	const div2Element = document.querySelector(".div2");
	const div3Element = document.querySelector(".div3");
	const admin_header = document.querySelector(".admin_head");
	const show_movie_btn = document.querySelector("#show_all_movies");
	const add_movies_btn = document.querySelector("#add_movies");
	const movie_para_element = document.querySelector(".movie_para");

	show_first_div();
	show_movie_btn.addEventListener("click", () => {
		fetch("http://54.146.239.101/movies")
			.then((response) => response.json())
			.then((movieObject) => {
				show_second_div();
				movieObject.forEach((new_movie) => {
					const brElement = document.createElement("br");
					const hrElement = document.createElement("hr");
					const movie_title = document.createElement("h1");
					const movie_id_element = document.createElement("h3");
					const movie_story_label = document.createElement("label");
					const movie_story_element = document.createElement("p");
					const movie_img_element = document.createElement("img");
					movie_img_element.setAttribute(
						"src",
						`./picture/${new_movie.title}.png`
					);
					movie_img_element.setAttribute("alt", `${new_movie.title}`);
					movie_img_element.style.width = "300px";
					movie_img_element.style.height = "300px";

					movie_id_element.innerHTML = "Movie id:- " + new_movie.id;
					movie_title.innerHTML = "Title:- " + new_movie.title;
					movie_story_label.innerHTML = "Story:-";
					movie_story_element.innerHTML = new_movie.story;
					movie_para_element.appendChild(movie_id_element);
					movie_para_element.appendChild(movie_title);
					movie_para_element.appendChild(movie_img_element);
					movie_para_element.appendChild(brElement);
					movie_para_element.appendChild(movie_story_label);
					movie_para_element.appendChild(movie_story_element);
					movie_para_element.appendChild(hrElement);
				});
			});
	});

	add_movies_btn.addEventListener("click", () => {
		show_third_div();

		const movie_submit_btn = document.querySelector("#submit");

		movie_submit_btn.addEventListener("click", () => {
			const movie_title_input = document.querySelector(".movie_title").value;
			const age_group_input = document.querySelector(".age_group").value;
			const actors_input = document.querySelector(".movie_actor").value;
			const movie_story_input = document.querySelector(".movie_story").value;
			const movie_rating_input =
				document.querySelector(".movie_rating").value + "/10";
			const movie_details = {
				title: movie_title_input,
				ageGroup: age_group_input,
				actor: actors_input,
				story: movie_story_input,
				rating: movie_rating_input,
			};
			add_movie(movie_details);
		});
	});

	function add_movie(movieData) {
		fetch("http://54.146.239.101/movies/addmovie", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(movieData),
		})
			.then((response) => response.json())
			.then((movieData) => {
				console.log("Success:", movieData);
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
};
