from fastapi import Depends, FastAPI , HTTPException, status, Security
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import pyrebase

app = FastAPI()

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

@app.get(
    "/users/token",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Consigue un token para el usuario",
    description="Consigue un token para el usuario",
    tags=["auth"],
)

def get_token(credentials: HTTPBasicCredentials = Depends(securityBasic)):
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