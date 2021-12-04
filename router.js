import renderHome from "./pages/home/homeRoute.js";
import renderLogin from "./pages/login/loginRoute.js";

export default function () {
	window.router = new Navigo("/", { hash: true });

	router
		.on({
			"/": () => {
				renderHome().then(router.updatePageLinks);
			},

			login: () => {
				renderLogin();
			},
		})
		.resolve();
}
