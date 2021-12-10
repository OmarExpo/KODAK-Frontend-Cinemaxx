import todayScript from "./today.js";

export default (auth) => {
	const content = document.querySelector(".content");
	fetch("./pages/today/today.html")
		.then((response) => response.text())
		.then((todayHtml) => {
			content.innerHTML = todayHtml;
			todayScript();
		});
};
