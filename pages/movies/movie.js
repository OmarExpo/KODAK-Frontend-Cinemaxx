function get_image_url_by_movie_name(movie_name) {
	return fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=eacfeabd8e111e3bea6edaa3358907aa&query=${movie_name}`
	)
		.then((response) => response.json())
		.then((movieObject) => {
			const movie_posterurl = movieObject.results[0].poster_path;

			fetch(`https://image.tmdb.org/t/p/w500/${movie_posterurl}`)
				.then((response) => response.blob())
				.then((movieObject) => {
					console.log(movieObject);
					var objectURL = URL.createObjectURL(movieObject);
					const image_element = document.querySelector(".card-body");
					const movie_img_element = document.createElement("img");
					movie_img_element.setAttribute("src", `${objectURL}`);
					movie_img_element.style.width = "300px";
					movie_img_element.style.height = "300px";
					image_element.appendChild(movie_img_element);
				});
		});
}
get_image_url_by_movie_name("titanic");
/*

fetch(`https://image.tmdb.org/t/p/w500/${movie_posterurl}`)
	.then((response) => response.blob())
	.then((movieObject) => {
		console.log(movieObject);
		var objectURL = URL.createObjectURL(movieObject);
		const image_element = document.querySelector(".card-body");
		const movie_img_element = document.createElement("img");
		movie_img_element.setAttribute("src", `${objectURL}`);
		movie_img_element.style.width = "300px";
		movie_img_element.style.height = "300px";
		image_element.appendChild(movie_img_element);
	});
*/
