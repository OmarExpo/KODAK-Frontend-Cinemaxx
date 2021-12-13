export default {
	logout: (auth) => {
		auth.signOut();
		localStorage.clear();
		window.location = "/";

		alert("SignOut Successfully from System");
	},
};
