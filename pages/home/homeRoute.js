import homeScript from "./home.js";

export default () => {
	const content = document.querySelector(".content");

	return fetch("./pages/home/home.html")
		.then((response) => response.text())
		.then((mainHtml) => {
			content.innerHTML = mainHtml;
			homeScript();
		});
};
