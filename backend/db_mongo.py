from motor.motor_asyncio import AsyncIOMotorClient

# Using the provided MongoDB Connection String
MONGO_URL = "mongodb+srv://yashbagul100_db_user:v5BqYuRmr1uBMyOn@clusternids.0gwj6hm.mongodb.net/"

client = AsyncIOMotorClient(MONGO_URL)
database = client.nids_database
user_collection = database.get_collection("users")
