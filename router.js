import renderHome from "./pages/home/homeRoute.js";
import renderLogin from "./pages/login/loginRoute.js";
import renderAdmin from "./pages/admin/adminRouter.js";

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
			admin: () => {
				renderAdmin();
			},
		})
		.resolve();
}
