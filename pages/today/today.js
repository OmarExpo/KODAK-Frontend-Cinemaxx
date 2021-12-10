import utils from "./../../utils.js";

export default (auth) => {
	fetch("http://3.90.205.148/schedules/today")
		.then((response) => response.json())
		.then((movieDetails) => {
			console.log(scheduleDetails);
            const movieDetailElement = document.querySelector(".movie-details");
            scheduleDetails.forEach(movietoshow => {
                
                
            });
		});
};
