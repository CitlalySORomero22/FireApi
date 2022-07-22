function login(){   

    let email = document.getElementById("email");
    let password  = document.getElementById("password");  
    let payload = {
        "email" : email.value,
        "password" : password.value
    }
    console.log(email.value);
    console.log(password.value );
    console.log(payload);

    var request = new XMLHttpRequest();
    request.open('POST', "https://8000-citlalysoromero-fireapi-vgmru85w7q3.ws-us54.gitpod.io/users/token",true);
    request.setRequestHeader("accept", "application/json");
    request.setRequestHeader("Authorization", "Basic " + btoa(payload.email + ":" + payload.password));
    request.setRequestHeader("Content-Type", "application/json");
 
    request.onload = () => {

        var response = request.response;
        console.log(response);
        if (request.status === 401 || request.status === 403) {
            alert(json.detail);
            Swal.fire({
                title: json.detail,
                text: json.detail,
                type: "error"
            }).then(function() {
                window.location = "/templates/login.html";
            });
        }
        else if (request.status == 202) {
            const response = request.responseText;
            const json = JSON.parse(response);
            console-console.log(json);
            sessionStorage.setItem("token", json.token);

            alert("Bienvenido")
            window.location = "../templates/bienvenida.html";
            /*Swal.fire({
                title: "Ya estas registrado(a)",
                text: "Bienvenido(a)",
                type: "success"
            }).then(function() {
                window.location = "../templates/bienvenida.html";
            });*/
        };
    
    };
    request.send(JSON.stringify(payload));
}