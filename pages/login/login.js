export default () => {
	var firebaseConfig = {
		apiKey: "AIzaSyDTOcIjbKFTmGUM_Tqy6F2Mk9RP1wXPQy4",
		authDomain: "cinemaxx-43706.firebaseapp.com",
		projectId: "cinemaxx-43706",
		storageBucket: "cinemaxx-43706.appspot.com",
		messagingSenderId: "984238243120",
		appId: "1:984238243120:web:c50b0dafb6c7102aea9cf5",
		measurementId: "G-B0VYHY4NLG",
	};

	firebase.initializeApp(firebaseConfig);
	let useremail = "";
	let userId = "";
	const database = firebase.database();
	const auth = firebase.auth();

	const secondDiv = document.querySelector("#div2");
	const firstDiv = document.querySelector("#div1");
	const thirdDiv = document.querySelector("#div3");
	secondDiv.style.display = "none";
	thirdDiv.style.display = "none";
	//signup function
	function signUp() {
		const email = document.getElementById("email_field");
		const password = document.getElementById("password_field");
		const username = document.getElementById("name_field");
		const number = document.getElementById("number_field");
		const address = document.getElementById("address_field");
		const favsport = document.getElementById("fsport_field");
		const promise = auth
			.createUserWithEmailAndPassword(email.value, password.value)
			.then((cred) => {
				alert(cred.user.uid);
				savetoDatabase(
					cred.user.uid,
					username.value,
					number.value,
					address.value,
					favsport.value
				);
			})
			.then(() => {
				alert("successfully created user and its database.");
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
				showDetail();
			})
			.catch((error) => {
				return console.log(error.message);
			});
	}

	//signOut

	function signOut() {
		auth.signOut();
		//window.location.replace("index.html");

		alert("SignOut Successfully from System");
	}

	//active user to homepage
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			useremail = user.email;
			userId = user.uid;
		} else {
			alert("No Active user Found");
		}
	});

	function savetoDatabase(uid, username, number, address, fsport) {
		firebase
			.database()
			.ref("user/" + uid)
			.set({
				username: username,
				number: number,
				address: address,
				fsport: fsport,
			});
	}
	function showDetail() {
		firstDiv.style.display = "none";
		secondDiv.style.display = "none";
		thirdDiv.style.display = "block";
		const username = document.querySelector("#username");
		const useremail = document.querySelector("#useremail");
		const userphone = document.querySelector("#userphone");
		const usersport = document.querySelector("#usersport");
		const useraddress = document.querySelector("#useraddress");

		var leadsRef = database.ref("user");
		leadsRef.on("value", function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				var childData = childSnapshot.val();

				username.innerHTML = "Name:- " + childData.username;
				userphone.innerHTML = "Phone number:- " + childData.number;
				usersport.innerHTML = "Favourite sprot:- " + childData.fsport;
				useraddress.innerHTML = "Address:- " + childData.address;
			});
		});
	}
	function showTwo() {
		const divone = document.querySelector("#div1");
		const divtwo = document.querySelector("#div2");
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
};
