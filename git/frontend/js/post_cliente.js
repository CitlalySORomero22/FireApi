function postCliente(){

    const token = sessionStorage.getItem('token');
    console.log(token);
    
    let nombre = document.getElementById("nombre");
    let email  = document.getElementById("email");

    let payload = {
        "nombre": nombre.value,
        "email" : email.value,
    }
    
    var request = new XMLHttpRequest(); 
    request.open('POST', "https://8000-citlalysoromero-fireapi-kv6dx2h3e2l.ws-us59.gitpod.io/clientes/",true);
    request.setRequestHeader("accept", "application/json");
    request.setRequestHeader("Authorization", "Bearer " + btoa(token));
    request.setRequestHeader("Content-Type", "application/json");

    request.onload = () => {
        
        const response  = request.responseText;
        const json      = JSON.parse(response); 
        
        const status    = request.status;

        if (request.status === 401 || request.status === 403) {
            alert(json.detail);
        }

        else if (request.status == 202){

            console.log("Response: " + response);
            console.log("JSON: " + json);
            console.log("Status: " + status);
            
            alert("Regresar a la lista de clientes ")
            window.location = "/templates/get_clientes.html";

            
        }
    };
    request.send(JSON.stringify(payload));
};