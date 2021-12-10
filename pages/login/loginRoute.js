import loginScript from "./login.js";

export default (auth) => {
	console.log(auth);
	const content = document.querySelector(".content");
	fetch("./pages/login/login.html")
		.then((response) => response.text())
		.then((loginHtml) => {
			content.innerHTML = loginHtml;
			loginScript(auth);
		});
};
