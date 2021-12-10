import adminScript from "./admin.js";

export default () => {
	const content = document.querySelector(".content");
	fetch("./pages/admin/admin.html")
		.then((response) => response.text())
		.then((adminHtml) => {
			content.innerHTML = adminHtml;
			adminScript();
		});
};
