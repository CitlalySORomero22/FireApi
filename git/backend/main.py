from fastapi import Depends, FastAPI , HTTPException, status, Security
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import pyrebase
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

class UserIN(BaseModel):
    email       : str
    password    : str

class Cliente (BaseModel):  
    nombre: str  
    email: str  

class ClienteIN (BaseModel):  
    id_cliente: str
    nombre: str  
    email: str  

class Respuesta (BaseModel) :  
    message: str  
                

origins = [
    "https://8080-citlalysoromero-fireapi-vgmru85w7q3.ws-us54.gitpod.io/",
    "https://8000-citlalysoromero-fireapi-vgmru85w7q3.ws-us54.gitpod.io/",
    "*",   
            
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hola"}

firebaseConfig = {
  "apiKey": "AIzaSyCVjbqmpNcAE2Ezy_cLcSu-nmjL4QvcOrM",
  "authDomain": "fastapi-c9969.firebaseapp.com",
  "databaseURL": "https://fastapi-c9969-default-rtdb.firebaseio.com",
  "projectId": "fastapi-c9969",
  "storageBucket": "fastapi-c9969.appspot.com",
  "messagingSenderId": "146684868957",
  "appId": "1:146684868957:web:f102cca4f9c4d978ead0b4",
  "measurementId": "G-RP3W4C7PWQ"
};

firebase = pyrebase.initialize_app(firebaseConfig)

securityBasic  = HTTPBasic()
securityBearer = HTTPBearer()

@app.post(
    "/users/token",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Consigue un token para el usuario",
    description="Consigue un token para el usuario",
    tags=["auth"],
)

def post_token(credentials: HTTPBasicCredentials = Depends(securityBasic)):
    try:
        email = credentials.username
        password = credentials.password
        auth = firebase.auth()
        user = auth.sign_in_with_email_and_password(email, password)
        #response=user
        response = {
            "token": user["idToken"]
        }
        return response
    except Exception as error:
        print(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED           
        )

@app.get(
    "/users/",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Consigue un usuario",
    description="Consigue un usuario",
    tags=["auth"]
)

async def get_user(credentials: HTTPAuthorizationCredentials = Depends(securityBearer)):
    try:
        auth = firebase.auth()
        user = auth.get_account_info(credentials.credentials)
        uid = user["users"][0]["localId"]

        db=firebase.database()
        user_data = db.child("users").child(uid).get().val()

        response = {
            "user_data" : user_data
        }
        return response
    except Exception as error:
        print(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED           
        )

@app.post(  "/users/",  
    status_code=status.HTTP_202_ACCEPTED, 
    summary="Crea un usuario",
    description="Crea un usuario", 
    tags=["auth"]
)

async def create_user(usuario: UserIN ):
    try:
        auth = firebase.auth()
        db=firebase.database()
        user = auth.create_user_with_email_and_password(usuario.email, usuario.password)
        uid = user["localId"]
        db.child("users").child(uid).set({"email": usuario.email, "level": 1 })
        
        response = {"Usuario Agregado"}
        return response
    except Exception as error:
        print(f"Error: {error}")

#Obtiene una lista de clientes registrados
@app.get(
    "/clientes/", 
    status_code=status.HTTP_202_ACCEPTED,
    summary="Regresa una lista de usuarios",
    description="Regresa una lista de usuarios"
)
async def get_clientes(credentials: HTTPAuthorizationCredentials = Depends(securityBearer)):
    try:
        db=firebase.database()
        clientes = db.child("clientes").get().val()
        response = {
            "clientes": clientes
        }
        return response
    except Exception as error:
        print(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No tienes permiso para ver estos datos",
            headers={"WWW-Authenticate": "Basic"},        
        )
    

#Obtiene un usuario por medio del id
@app.get(
    "/clientes/{id}", 
    status_code=status.HTTP_202_ACCEPTED,
    summary="Consigue un usuario",
    description="Consigue un usuario",
    tags=["auth"]
)
async def get_cliente_id(id_cliente: str, credentials: HTTPAuthorizationCredentials = Depends(securityBearer)):
    try:       

        db=firebase.database()
        id=id_cliente
        print(id)
        cliente = db.child("clientes").child(id).get().val()

        response = {
            "cliente" : cliente
        }
        return response
    except Exception as error:
        print(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED           
        )

#Ingresa un nuevo usuario 
@app.post("/clientes/", 
    status_code=status.HTTP_202_ACCEPTED,
    summary="Inserta un usuario",
    description="Inserta un usuario",
    tags=["auth"]
)
async def post_clientes(cliente: Cliente, credentials: HTTPAuthorizationCredentials = Depends(securityBearer)):
    try:
        db=firebase.database()
        db.child("clientes").push({"Nombre": cliente.nombre, "Email": cliente.email})
        response = {"code": status.HTTP_201_CREATED, "message": "Usuario creado"}
        return response
    except Exception as error:
        print(f"Error: {error}")
        return(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    
#Actualiza un usuario
@app.put(
    "/clientes/", 
    response_model=Respuesta,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Actualiza un usuario",
    description="Actualiza un usuario"
)
async def put_clientes(cliente:ClienteIN, credentials: HTTPAuthorizationCredentials = Depends(securityBearer)):
    try:     
        db=firebase.database()
        db.child("clientes").child(cliente.id_cliente).update({"Nombre": cliente.nombre, "Email": cliente.email})
        response = {"message":"Cliente actualizado"}
        return response
    except Exception as error:
        print(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED           
        )
    
#Elimina un usuario
@app.delete(
    "/clientes/{id_cliente}", 
    response_model=Respuesta,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Elimina un usuario",
    description="Elimina un usuario",
    tags=["auth"]
)
async def delete_clientes(id_cliente: str, credentials: HTTPAuthorizationCredentials = Depends(securityBearer)):
    try:       
        db=firebase.database()
        id=id_cliente
        print(id)
        db.child("clientes").child(id).remove()
        response = {"message":"Cliente eliminado"}
        return response
    except Exception as error:
        print(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED           
        )