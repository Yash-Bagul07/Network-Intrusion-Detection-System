from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from db_mongo import user_collection
from auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str # Accepting either username or email as the 'username' field for login
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegister):
    # Check if user already exists
    existing_user = await user_collection.find_one({
        "$or": [{"username": user.username}, {"email": user.email}]
    })

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Create new user dictionary
    new_user = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password
    }

    # Insert into database
    await user_collection.insert_one(new_user)
    
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    # Find user by username or email
    user = await user_collection.find_one({
        "$or": [{"username": user_credentials.username}, {"email": user_credentials.username}]
    })

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"username": user["username"], "email": user["email"]}
    }
