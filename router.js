import renderHome from "./pages/home/homeRoute.js";
import renderLogin from "./pages/login/loginRoute.js";
import renderAdmin from "./pages/admin/adminRouter.js";
import renderToday from "./pages/today/todayRoute.js";
import renderWeek from "./pages/week/weekRoute.js";

export default function () {
	window.router = new Navigo("/", { hash: true });
	console.log(window.auth);
	router
		.on({
			"/": () => {
				renderHome().then(router.updatePageLinks);
			},

			login: () => {
				renderLogin(window.auth);
			},
			admin: () => {
				renderAdmin();
			},
			today: () => {
				renderToday();
			},
			week: () => {
				renderWeek();
			},
		})
		.resolve();
}
