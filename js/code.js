var urlBase = "www.contacks.club";
var contactId = 0;

var searchVal = 0;
var userId = "";
var firstName = "";
var lastName = "";
var userEmail = "";
var password = "";

var currentSearch = false;

function doLogin()
{
	userId = -1;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + hash + '"}';
//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = '/LAMPAPI/Login.php';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				//var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.Login;

				console.log("userId : " + userId);
				console.log(jsonObject.Password);

				if( jsonObject.Login != login || jsonObject.Password != hash)
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

				saveCookie();

				window.location.href = "home.html";

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = -1;
	firstName = "";
	lastName = "";
	document.cookie = "FirstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doCreate()
{
	var email = document.getElementById("create-acc-email").value;
	var fname = document.getElementById("create-acc-fname").value;
	var lname = document.getElementById("create-acc-lname").value;
	var userLogin = document.getElementById("create-acc-usr").value;
	var passwd = document.getElementById("create-acc-passwd").value;

	passwd = md5(passwd);

	if(email.length == 0 || fname.length == 0 || lname.length == 0 || userLogin.length == 0 || passwd.length == 0) {
		document.getElementById("create-result").innerHTML = "invalid inputs, try again";
		return;
	}

	var jsonPayload = '{"email" : "' + email + '", "FirstName" : "' + fname + '", "LastName" : "' + lname + '", "Login" : "' + userLogin + '", "Password" : "' + passwd + '"}';

	var url = '/LAMPAPI/Register.php';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				userId = userLogin;
				firstName = fname;
				lastName = lname;
				window.location.href = "home.html";
				var topName = document.getElementById("userName");
				topName.innerHTML = "Logged in as " + firstName + " " + lastName;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("create-result").innerHTML = err.message;
	}
}


function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "FirstName=" + firstName + ",LastName=" + lastName + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "FirstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "LastName" )
		{
			lastName = tokens[1];
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

// function appendContact(fname, lname, email, phone) {
//
// }

function addContact() {
    var fName = document.getElementById("fname").value;
    var lName = document.getElementById("lname").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;

	if(phone.length > 10 || email.length > 100 || lName.length > 50 || fName.length > 50) {
		document.getElementById("add-result").innerHTML = "Error, invalid input";
		return;
	}

	document.getElementById("add-result").innerHTML = "";

	var ul = document.getElementById("contact-ul");
	var li = document.createElement("li");

	contactId++;
	var id = contactId;


	li.setAttribute('id', "li-" + id);
	li.setAttribute('class', "listed-contacts");
	li.innerHTML = document.getElementById("new-card").innerHTML;

	ul.appendChild(li);

	var contactName = document.getElementById("contact-name-");
	var contactEmail = document.getElementById("contact-email-");
	var contactPhone = document.getElementById("contact-phone-");

	var contactEditfName = document.getElementById("edit-fname-");
	var contactEditlName = document.getElementById("edit-lname-");
	var contactEditEmail = document.getElementById("edit-email-");
	var contactEditPhone = document.getElementById("edit-phone-");

	var contactCard = document.getElementById("card-");
	var contactFront = document.getElementById("contact-front-");
	var contactBack = document.getElementById("contact-back-");

	contactName.setAttribute('id', "contact-name-" + id);
	contactEmail.setAttribute('id', "contact-email-" + id);
	contactPhone.setAttribute('id', "contact-phone-" + id);

	contactEditfName.setAttribute('id', "edit-fname-card-" + id);
	contactEditlName.setAttribute('id', "edit-lname-card-" + id);
	contactEditEmail.setAttribute('id', "edit-email-card-" + id);
	contactEditPhone.setAttribute('id', "edit-phone-card-" + id);

	contactEditfName.setAttribute('placeholder', fName);
	contactEditlName.setAttribute('placeholder', lName);
	contactEditEmail.setAttribute('placeholder', email);
	contactEditPhone.setAttribute('placeholder', phone);


	contactCard.setAttribute('id', "card-" + id);
	contactFront.setAttribute('id', "contact-front-card-" + id);
	contactBack.setAttribute('id', "contact-back-card-" + id);

	document.getElementById("contact-name-" + id).innerHTML = fName + " " + lName;
	document.getElementById("contact-email-" + id).innerHTML = email;
	document.getElementById("contact-phone-" + id).innerHTML = phone;

	document.addContactForm.reset();

    var jsonPayload = '{"Login" : "' + userId + '", "FirstName" : "' + fName + '", "LastName" : ' + lName + '", "email" : ' + email + '", "phone" : ' + phone + '", "pinned" : ' + 0 + '}';
    var url = '/LAMPAPI/AddContact.php';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
		//var jsonObject = JSON.parse( xhr.responseText );
		xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            document.getElementById("add-result").innerHTML = "Contact Added";
			/* this is where the add contact should go --> if it's added to the database then
			   upload it to the list */
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        document.getElementById("add-result").innerHTML = err.message;
    }
}

function searchField(searchValue) {
	if (searchValue == 0)
		searchVal = 0;

	else if (searchValue == 1)
		searchVal = 1;

	else if (searchValue == 2)
		searchVal = 2;
}

function search() {

	var searchType = [
		document.getElementsByClassName('contact-name'),
		document.getElementsByClassName('contact-email'),
		document.getElementsByClassName('contact-phone'),
	];

	var contactNameList = searchType[searchVal];
	var input = document.getElementById('search-txt').value;
	var i, index, id;

	var fullList = document.getElementById('contact-ul');
	var currentSearchList = document.getElementById('search-list');

	//makeHidden();
	if(currentSearch == true) {
		var items = currentSearchList.childNodes;
		for(var j = 0; j <= items.length; j++) {
 			fullList.appendChild(items[j]);
		}
		document.getElementById('inbetween').style.display = 'none';
		currentSearch = false;
	}

	for (i = 0; i < contactNameList.length; i++) {
		if (contactNameList[i].textContent == input)
		{
			currentSearch = true;
			document.getElementById('inbetween').style.display = 'block';
			index = i;
			id = contactNameList[i].id;
			var card = document.getElementById(contactNameList[index].id).parentNode.parentNode.parentNode.parentNode;
			console.log(card);
			currentSearchList = document.getElementById('search-list');
			currentSearchList.appendChild(card);
		}
	}


	// for (i = 0; i < contactNameList.length && i != index; ++i)
	// 	document.getElementById(contactNameList[i].id).parentNode.parentNode.parentNode.parentNode.setAttribute("style", "visibility: hidden;");

	// document.getElementById(id).parentNode.parentNode.parentNode.parentNode.setAttribute("style", "visibility: visible;");

	// var card = document.getElementById(contactNameList[index].id).parentNode.parentNode.parentNode.parentNode;
	// var ul = document.getElementById("contact-ul").setAttribute("style", "visibility: hidden");
	// makeHidden();
	// var resultList = document.getElementById('search-list');
	// ul.appendChild(card);
	// resultList.appendChild(card);
}

function searchContact() {

	var srch = document.getElementById("search-txt").value;
	document.getElementById("search-results").innerHTML = "";

	var searchType = [
		document.getElementsByClassName('contact-name'),
		document.getElementsByClassName('contact-email'),
		document.getElementsByClassName('contact-phone'),
	];

	var contactList = "";

	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';

	var url = '/LAMPAPI/SearchContacts.php';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				document.getElementById("search-results").innerHTML = "Contact found";
				var jsonObject = JSON.parse(xhr.responseText);

				for(var i = 0; i < jsonObject.results.length; i++) {
					contactList += jsonObject.results[i];
					if(i < jsonObject.results.length - 1) {
						contactList += "<br />\r\n";
					}
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("search-results").innerHTML = err.message;
	}
}

// function predictor(input) {
//
// 	// Gotta make sure that you can actually access the cards
// 	// as they appear from the database.
//
// 	var i, div, txt;
// 	var input = document.getElementById('search-txt');
// 	var filter = input.value.toUpperCase();
// 	var ul = document.getElementById('contact-ul');
// 	var li = ul.getElementsByTagName('li');
//
// 	for (i = 0; i < li.length; i++)
// 	{
// 		div = li[i].getElementsByTagName("div")[0];
// 		txt = div.textContent || div.innerText;
// 		if (txt.toUpperCase().indexOf(filter) > -1) {
// 			li[i].style.display = "";
// 		}
// 		else {
// 			li[i].style.display = "none";
// 		}
// 	}
// }

function expandForm() {
    var form = document.getElementById("expand-add");
    var btn = document.getElementById('expand-add-btn');

	var searchBar = document.getElementById('expand-search');
	if(searchBar.style.display != 'none') {
		searchBar.style.display = 'none';
	}

    if(form.style.display == 'block') {
        form.style.display = 'none';
    }
    else {
        form.style.display = 'block';
    }
}

function expandSearch() {
    var form = document.getElementById("expand-search");
    var btn = document.getElementById('expand-search-btn');

	var add = document.getElementById('expand-add');

	if(add.style.display != 'none') {
		add.style.display = 'none';
	}

    if(form.style.display == 'block') {
        form.style.display = 'none';
    }
    else {
        form.style.display = 'block';
    }
}


function fadeOutOnScroll(element) {
	if (!element) {
		return;
	}

	var distanceToTop = window.pageYOffset + element.getBoundingClientRect().top;
	var elementHeight = element.offsetHeight;
	var scrollTop = document.documentElement.scrollTop;

	var opacity = 1;

	if (scrollTop > distanceToTop) {
		opacity = 1 - (scrollTop - distanceToTop) / elementHeight;
	}

	if (opacity >= 0) {
		element.style.opacity = opacity;
	}
}

function scrollHandler() {
    var home = document.getElementById('home');
	fadeOutOnScroll(home);
}

window.addEventListener('scroll', scrollHandler);

function deleteContact(contactId) {
	var proceed = confirm("This will remove the contact PERMANENTLY, are you sure you want to proceed?");
	if (proceed) {
		var url = '/LAMPAPI/DeleteContact.php'
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try {
			xhr.onreadystatechange = function() {
				if(this.readyState == 4 && this.status == 200) {
					document.getElementById($(contactId).attr("id")).remove();
				}
			};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("search-results").innerHTML = err.message;
	}

	}
	else return;
}

function flipContact(cardSide, contactToFlip) {
	contactToFlip = $(contactToFlip).attr("id");
	var card = document.getElementById(contactToFlip);
	var front = document.getElementById('contact-front-' + contactToFlip);
	var back = document.getElementById('contact-back-' + contactToFlip)

	if(cardSide == 0) {
		front.style.display = 'none'
		back.style.backfaceVisibility = 'visible';
		back.style.display = 'block';
		editContact();
	}
	else if(cardSide == 1) {
		back.style.display = 'none';

		front.style.backfaceVisibility = 'visible';
		front.style.display = 'block';
	}
}

function saveContact(contactToFlip) {
	var id = $(contactToFlip).attr("id");
	
	var pinValue = 0;

	if(id.contains("pinned")) {
		pinValue = 1;
	}

	console.log(id)
	var fName = document.getElementById("edit-fname-" + id).value;
    var lName = document.getElementById("edit-lname-" + id).value;
	var email = document.getElementById("edit-email-" + id).value;
	var phone = document.getElementById("edit-phone-" + id).value;

	if(phone.length > 10) {

	}

	var str = id;
	str = str.split("-").pop();

	document.getElementById("contact-name-" + str).innerHTML = fName + " " + lName;
	document.getElementById("contact-email-" + str).innerHTML = email;
	document.getElementById("contact-phone-" + str).innerHTML = phone;

	var jsonPayload = '{"FirstName" : "' + fName + '", "LastName" : ' + lName + '", "email" : ' + email + '", "phone" : ' + phone + '", "pinned" : ' + pinValue + '}';
    var url = '/LAMPAPI/UpdateContact.php';

	var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
		xhr.onreadystatechange = function() {
        	if(this.readyState == 4 && this.status == 200) {
			
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
		console.log(err);
    }

	flipContact(1, contactToFlip);
}



function dropBtnToggle() {
	document.getElementById('dropdown-list').classList.toggle('show');
}

function displayOnClick(idValue) {
	document.getElementById('cat-btn').innerHTML = idValue;
}

window.onclick = function(event) {
	if (!event.target.matches('.dropdown-btn')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}

function getStyleSheet(unique_title) {
	for (var i=0; i<document.styleSheets.length; i++) {
		var sheet = document.styleSheets[i];
	  	if (sheet.title == unique_title) {
			return sheet;
		}
	}
}

function pinContact(btn, contactToPin) {
	var id = $(contactToPin).attr("id");
	var pinValue = 1;
	var card = document.getElementById(id);
	var ul = card.parentNode.parentNode.parentNode;

	if(btn.style.color = "goldenrod") {
		pinValue = 0;
		btn.style.color = "black";
		var str = id.split(" ");
		card.setAttribute("id", str[0]);
	}
	else {
		btn.style.color = "goldenrod";
		card.setAttribute("id", id + " pinned");
	}

	var str = id;
	idNum = str.split("-").pop();

	var name = document.getElementById("contact-name-" + idNum);
	name = $(name).attr("id")
	name = name.split(" ");
	var fName = name[0];
	var lName = name[1];
	var email = document.getElementById("contact-email-" + idNum);
	var phone = document.getElementById("contact-phone-" + idNum);

	ul.prepend(card);

	var jsonPayload = '{"Login" : "' + userId + '", "FirstName" : "' + fName + '", "LastName" : ' + lName + '", "email" : ' + email + '", "phone" : ' + phone + '", "pinned" : ' + pinValue + '}';
    var url = '/LAMPAPI/UpdateContact.php';
	var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
		xhr.onreadystatechange = function() {
        	if(this.readyState == 4 && this.status == 200) {
			
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
		console.log(err);
    }
}