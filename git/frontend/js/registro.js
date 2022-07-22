function PostRegUser(){
    var request = new XMLHttpRequest();


    let email = document.getElementById("email");
    let password  = document.getElementById("password");  
    let payload = {
        "email" : email.value,
        "password" : password.value
    }
    console.log(email.value);
    console.log(password.value );
    console.log(payload);

    request.open('POST', "https://8000-citlalysoromero-fireapi-vgmru85w7q3.ws-us54.gitpod.io/users/",true);
    request.setRequestHeader("accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json");
 
    request.onload = () => {
        if (request.status === 401 || request.status === 403) {
            alert(json.detail);
        }
        else if (request.status == 202){
            const response = request.responseText;
            const json = JSON.parse(response);
            console-console.log(json);
            alert("Usuario agregado");

        }  
    };
    request.send(JSON.stringify(payload));
}