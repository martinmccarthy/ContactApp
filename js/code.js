var userId = 0;
var urlBase = "website.com";

function addContact() {
    var newContact = document.getElementById("contact-txt").value;
    document.getElementById("add-result").innerHTML = "";

    var jsonPayload = '{"contact" : "' + newContact + '", "userId" : ' + userId + '}';
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