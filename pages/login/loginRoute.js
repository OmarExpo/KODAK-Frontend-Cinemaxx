import loginScript from "./login.js";

export default () => {
	const content = document.querySelector(".content");
	fetch("./pages/login/login.html")
		.then((response) => response.text())
		.then((loginHtml) => {
			content.innerHTML = loginHtml;
			loginScript();
		});
};