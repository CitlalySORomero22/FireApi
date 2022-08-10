function getCliente(){

    const token = sessionStorage.getItem('token')
    var id_cliente = window.location.search.substring(1);
    console.log("id_cliente: " + id_cliente);
    
    
    var request = new XMLHttpRequest();
    request.open('GET', "https://8000-citlalysoromero-fireapi-kv6dx2h3e2l.ws-us59.gitpod.io/clientes/{id}?id_cliente="+ id_cliente,true);
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Authorization", "Bearer " + btoa(token));
    request.setRequestHeader("content-type", "application/json");
    
    
    
    
    request.onload = () => {
        
        const response  = request.responseText;
        const json      = JSON.parse(response);
        nombre=json.cliente.Nombre;
        email=json.cliente.Email;

        const status    = request.status;

        if (request.status === 401 || request.status === 403) {
            alert(json.detail);
        }

        else if (request.status == 202){

           /* console.log("Response: " + response);
            console.log("JSON: "     + json.cliente);
            console.log("Status: "   + status);
            console.log("Nombre: "+ json.cliente.Nombre);
            console.log("Email:  "+ json.cliente.Email);*/

            let nombre  = document.getElementById("nombre");
            let email   = document.getElementById("email");

            nombre.value    = json.cliente.Nombre;
            email.value     = json.cliente.Email;
        }
        else if(status==404){
            let nombre  = document.getElementById("nombre");
            let email   = document.getElementById("email");

            nombre.value    = "None";
            email.value     = "None";
            alert("Cliente no encontrado");
        }
    }
    request.send();
}