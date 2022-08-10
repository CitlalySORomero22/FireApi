function getClientes() {

    const token = sessionStorage.getItem('token');
    //console.log (token);

    var request = new XMLHttpRequest();
    request.open('GET', "https://8000-citlalysoromero-fireapi-kv6dx2h3e2l.ws-us59.gitpod.io/clientes/");
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Authorization", "Bearer " + btoa(token));
    request.setRequestHeader("content-type", "application/json");
    
    const  tabla    = document.getElementById("tabla_clientes");
    var tblBody     = document.createElement("tbody");
    var tblHead     = document.createElement("thead");

    tblHead.innerHTML = `
        <tr class="w3-blue">
            <th>ID Cliente</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Detalle</th>
            <th>Actualizar</th>
            <th>Borrar</th>
        </tr>`;

    request.onload = () => {
        // Almacena la respuesta en una variable, si es 202 es que se obtuvo correctamente
        const response = request.responseText;
        const json = JSON.parse(response);

        console.log(json);

        if (request.status === 401 || request.status === 403) {
            alert(json.detail);
        }
        
        else if (request.status == 202){
            const response = request.responseText;
            const parseo_json = JSON.parse(response);
            
            for (var key in parseo_json) {
                
                for (var id in parseo_json[key]) {
                    console.log(id);
                    console.log(parseo_json[key][id].Nombre)
                    var tr          = document.createElement('tr');
                    var id_cliente  = document.createElement('td');
                    var nombre      = document.createElement('td');
                    var email       = document.createElement('td');
                    var detalle     = document.createElement('td');
                    var actualizar  = document.createElement('td');
                    var borrar      = document.createElement('td');

                
                    id_cliente.innerHTML    = id;
                    nombre.innerHTML        = parseo_json[key][id].Nombre;
                    email.innerHTML         = parseo_json[key][id].Email;
                    detalle.innerHTML       = "<a class='btn btn-info btn-sm' href='/templates/get_cliente.html?"+id+"'><span class='glyphicon glyphicon-list-alt'></span>  Detalle</a>";
                    actualizar.innerHTML    = "<a class='btn btn-info btn-sm' href='/templates/update_clientes.html?"+id+"'><span class='glyphicon glyphicon-pencil'></span>  Actualizar</a>";
                    borrar.innerHTML        = "<a class='btn btn-info btn-sm' href='/templates/delete_clientes.html?"+id+"'><span class='glyphicon glyphicon-trash'>  Borrar</a>";
                    

                    tr.appendChild(id_cliente);
                    tr.appendChild(nombre);
                    tr.appendChild(email);
                    tr.appendChild(detalle);
                    tr.appendChild(actualizar);
                    tr.appendChild(borrar);                
                    tblBody.appendChild(tr);
                }
            }
            tabla.appendChild(tblHead);
            tabla.appendChild(tblBody);
        }
    };
    request.send();
}