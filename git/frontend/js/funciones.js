var data = sessionStorage.getItem('token')

function Authentication(){
        
    if(data == null){
        alert("No has iniciado sesión")
        window.location = "/templates/login.html";
    
    }

    if(data != null){
        alert("Bienvenido, ya iniciaste sesión")
    }
}

function logout(){
    sessionStorage.clear(data)
    window.location = "/templates/login.html";
}