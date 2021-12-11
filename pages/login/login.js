import utils from "./../../utils.js";
export default (auth) => {
	let useremail = "";
	let userId = "";

	const secondDiv = document.querySelector(".div2");
	const firstDiv = document.querySelector(".div1");
	const thirdDiv = document.querySelector(".div3");
	const signoutBtn = document.querySelector(".signOut");
	signoutBtn.addEventListener("click", () => {
		utils.logout(auth);
	});
	secondDiv.style.display = "none";
	thirdDiv.style.display = "none";
	//signup function
	function signUp() {
		const first_name = document.querySelector(".fname_field");
		const last_name = document.querySelector(".lname_field");
		const birth_date = document.querySelector(".date_birth");
		const userphone = document.querySelector(".number_field");
		const useremail = document.querySelector(".email_field");
		const userpassword = document.querySelector(".password_field");

		const promise = auth
			.createUserWithEmailAndPassword(useremail.value, userpassword.value)
			.then((cred) => {
				alert(cred.user.uid);
				savetoDatabase(
					cred.user.uid,
					first_name.value,
					last_name.value,
					useremail.value,
					userphone.value,
					birth_date.value
				);
				const data = {
					firstName: first_name.value,
					lastName: last_name.value,
					email: useremail.value,
					phoneNumber: userphone.value,
					birthDate: birth_date.value,
				};

				addUser(data);
			})
			.then(() => {
				alert("successfully created user and its database.");
				location.reload();
			});

		promise.catch((e) => alert(e.message));
		alert("SignUp Successfully");
	}

	//signIN function
	function signIn() {
		const email = document.getElementById("email");
		const password = document.getElementById("password");
		auth
			.signInWithEmailAndPassword(email.value, password.value)
			.then((cred) => {
				useremail = cred.user.email;

				if (useremail === "admin@gmail.com") {
					localStorage.setItem("username", "admin@gmail.com");

					location.href = "/#/admin";
				} else {
					location.href = "/";
				}
			})
			.catch((error) => {
				return console.log(error.message);
			});
	}

	//active user to homepage
	window.auth.onAuthStateChanged((user) => {
		if (user) {
			//localStorage.clear();
			useremail = user.email;
			userId = user.uid;
			if (localStorage["username"] === "admin@gmail.com") {
				localStorage.setItem("username", "admin@gmail.com");
				window.location = "/#/admin";
			} else {
				localStorage.setItem("username", user.email);
			}
		} else {
			//alert("No Active user Found");
		}
	});

	function savetoDatabase(
		uid,
		first_name,
		last_name,
		email,
		number,
		birth_date
	) {
		firebase
			.database()
			.ref("user/" + uid)
			.set({
				first_name: first_name,
				last_name: last_name,
				email: email,
				number: number,
				birth_date: birth_date,
			});
	}
	// This code  fetchs user data from firebase database and displays
	/*
	function showDetail() {
		firstDiv.style.display = "none";
		secondDiv.style.display = "none";
		thirdDiv.style.display = "block";
		const first_name = document.querySelector(".first_name");
		const last_name = document.querySelector(".last_name");
		const birth_date = document.querySelector(".birth_date");
		const userphone = document.querySelector(".number");
		const useremail = document.querySelector(".email");
	
		var leadsRef = window.database.ref("user");
		leadsRef.on("value", function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				var childData = childSnapshot.val();
				console.log(childData.first_name);
				first_name.innerHTML = "First Name:- " + childData.first_name;
				//last_name.innerHTML = "Last Name:- " + childData.last_name;
				//birth_date.innerHTML = "Date of birth:- " + childData.birth_date;
				//userphone.innerHTML = "Phone number:- " + childData.number;
				//useremail.innerHTML = "Email:- " + childData.email;
			});
		});
		
	}
*/
	function showTwo() {
		const divone = document.querySelector(".div1");
		const divtwo = document.querySelector(".div2");
		divone.style.display = "none";
		divtwo.style.display = "block";
	}
	const signUpButtonObject = document.querySelector("#signUp1");
	signUpButtonObject.addEventListener("click", () => {
		showTwo();
	});
	const signInButtonObject = document.querySelector("#sign_inBtn");
	signInButtonObject.addEventListener("click", () => {
		signIn();
	});
	const signOutButtonObject = document.querySelector(".signOut");
	signOutButtonObject.addEventListener("click", () => {
		signOut();
	});
	const finalSignUpButtonObject = document.querySelector("#final-signup-btn");
	finalSignUpButtonObject.addEventListener("click", () => {
		signUp();
	});

	function addUser(data) {
		fetch("http://3.90.205.148/users/adduser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
};
