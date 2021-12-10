import weekScript from "./week.js";

export default (auth) => {
	const content = document.querySelector(".content");
	fetch("./pages/week/week.html")
		.then((response) => response.text())
		.then((weekHtml) => {
			content.innerHTML = weekHtml;
			weekScript();
		});
};