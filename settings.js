export default function () {
	const isLocalhost =
		window.location.host.indexOf("127.0.0.1") != -1 ||
		window.location.host.indexOf("localhost") != -1;

	const localApiUrl = "http://localhost:5552";
	//const prodApiUrl = "https://tomas-order-site.herokuapp.com";
	const prodApiUrl = "http://3.90.205.148/schedules";

	// when fetching data from the api we need to know what the url is
	// It is different if you are developing locally or have the site deployed
	window.apiUrl = isLocalhost ? localApiUrl : prodApiUrl;

	// Firebase authentication which handles the login and logout functionality
	var firebaseConfig = {
		apiKey: "AIzaSyDTOcIjbKFTmGUM_Tqy6F2Mk9RP1wXPQy4",
		authDomain: "cinemaxx-43706.firebaseapp.com",
		projectId: "cinemaxx-43706",
		storageBucket: "cinemaxx-43706.appspot.com",
		messagingSenderId: "984238243120",
		appId: "1:984238243120:web:c50b0dafb6c7102aea9cf5",
		measurementId: "G-B0VYHY4NLG",
	};

	firebase.initializeApp(firebaseConfig);

	window.database = firebase.database();
	window.auth = firebase.auth();
}
