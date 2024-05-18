document.addEventListener("DOMContentLoaded", function(){
    document.forms["contact-form"].addEventListener("submit", postData);
});

function postData(formsubmission){
    formsubmission.preventDefault();

    var submitButton = document.getElementById("submit-button");
    submitButton.disabled = true;
    submitButton.textContent = "Wait";

    var firstName = encodeURIComponent(document.getElementById("first_name").value);
    var lastName = encodeURIComponent(document.getElementById("last_name").value);
    var email = encodeURIComponent(document.getElementById("email").value);
    var website = encodeURIComponent(document.getElementById("website").value);
    var phone = encodeURIComponent(document.getElementById("phone").value);
    var message = encodeURIComponent(document.getElementById("message").value);

    // Checks if fields are filled-in or not, returns response "<p>Please enter your details.</p>" if not.
    if(firstName == "" || lastName == "" || email == "" || phone == "" || message == ""){
        document.getElementById("response").innerHTML = "<p>Please enter your details.</p>";
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
        return;
    }

    // Parameters to send to PHP script. The bits in the "quotes" are the POST indexes to be sent to the PHP script.
    var params = "first_name=" + firstName + "&last_name=" + lastName + "&email=" + email + "&url=" + website + "&phone=" + phone + "&message=" + message;

    var http = new XMLHttpRequest();
    http.open("POST", "send.php", true);

    // Set Content-type header
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function(){
        if(http.readyState == 4 && http.status == 200){
            var response = JSON.parse(http.responseText);
            if (Array.isArray(response)) {
                var html = '';
                response.forEach(function(element) {
                    html += element;
                });
                document.getElementById("response").innerHTML = html;
            } else {
                document.getElementById("response").innerHTML = response;
            }

            // Enable the submit button again only if there is an error message
            if (http.status !== 200 || response.includes("error")) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit";
            }
        }
    }
    http.send(params);
}