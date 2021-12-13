export default {
	logout: (auth) => {
		auth.signOut();
		localStorage.clear();
		window.location = "/";

		alert("Successfully signed out");
	},
};
