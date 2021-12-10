export default {
	logout: (auth) => {
		auth.signOut();
		localStorage.clear();
		window.location = "http://127.0.0.1:5501/";

		alert("SignOut Successfully from System");
	},
};
