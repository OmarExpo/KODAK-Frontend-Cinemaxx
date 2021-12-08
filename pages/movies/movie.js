fetch("http://image.tmdb.org/t/p/w500/xRyINp9KfMLVjRiO5nCsoRDdvvF.jpg")
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

/*
				
				movieObject.forEach((new_movie) => {
					
					const movie_story_element = document.createElement("p");
					const movie_img_element = document.createElement("img");
					movie_img_element.setAttribute(
						"src",
						`./picture/${new_movie.title}.png`
					);
					movie_img_element.setAttribute("alt", `${new_movie.title}`);
					movie_img_element.style.width = "300px";
					movie_img_element.style.height = "300px";*/
