function login(){   

    let email = document.getElementById("email");
    let password  = document.getElementById("password");  
    let payload = {
        "email" : email.value,
        "password" : password.value
    }
    /*console.log(email.value);
    console.log(password.value );
    console.log(payload);*/

    var request = new XMLHttpRequest();
    request.open('POST', "hhttps://8000-citlalysoromero-fireapi-kv6dx2h3e2l.ws-us59.gitpod.io/users/token",true);
    request.setRequestHeader("accept", "application/json");
    request.setRequestHeader("Authorization", "Basic " + btoa(payload.email + ":" + payload.password));
    request.setRequestHeader("Content-Type", "application/json");
 
    
    request.onload = () => {
        let response = request.responseText;
        const json1 = JSON.parse(response);
        console-console.log(json1);
        sessionStorage.setItem("token", json1.token);

        Swal.fire({
            title: "Bienvenido",
            text: "Bienvenido",
            type: "success"
        }).then(function() {
            window.location = "/templates/inicio.html";
        });

        
        var jsonformateado = response.replace("Error: [Errno 400 Client Error: Bad Request for url: https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBoM8UTB3QctzA873CuWBDWM_y7bGoo0bk] " , "");
        const json = JSON.parse(jsonformateado);
        var obj = JSON.parse( json );
        var code = obj.error.code;
        var message = obj.error.message;
       //console.log(code);
       console.log(message);
        

        if (code==400 && message == "INVALID_PASSWORD"){
            Swal.fire({
                title: "Contraseña invalida",
                text: "Por favor ingrese una contraseña valida",
                type: "error"
            }).then(function() {
                window.location = "/templates/login.html";
            });
        }
        else if(code==400 && message == "EMAIL_NOT_FOUND"){
            Swal.fire({
                title: "Usuario no encontrado",
                text: "Por favor ingrese un usuario valido",
                type: "error"
            }).then(function() {
                window.location = "/templates/login.html";
            });
        }
        else if(code==400 && message == "INVALID_EMAIL"){                
            Swal.fire({
                title: "Correo invalido",
                text: "Revisar el correo electronico",
                type: "error"
            }).then(function() {
                window.location = "/templates/login.html";
            });
        }
    
    };
    request.send(JSON.stringify(payload));
}