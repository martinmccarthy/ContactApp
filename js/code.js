var userId = 0;
var urlBase = "contacks.club";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.php';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

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

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
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
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
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

function addContact() {
    var fName = document.getElementById("fname").value;
    var lName = document.getElementById("lname").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;
	document.getElementById("add-result").innerHTML = "";

    var jsonPayload = '{"firstName" : "' + fName + '", "lastName" : ' + lName + '", "email" : ' + email + '", "phone" : ' + phone + '", "userId" : ' + userId + '}';
    var url = urlBase + '/AddContact.php';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                document.getElementById("add-result").innerHTML = "Contact Added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        document.getElementById("add-result").innerHTML = err.message;
    }
}

function searchContact() {
    var srch = document.getElementById("search-txt").value;
    document.getElementById("search-results").innerHTML = "";

    var contactList = "";

    var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
    var url = urlBase + '/SearchContacts.php';
    
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

function flipContact() {
	var card = document.getElementById('card');
	var front = document.getElementById('contact');
	var back = document.getElementById('contact-back')
	
	card.classList.toggle('flipped');
	if(front.style.display == 'contents') {
		front.style.display = 'none';
		back.style.display = 'contents';
	}
	
}