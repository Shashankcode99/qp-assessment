# Getting Started with Project

This project is built with help of the follwoing:

**Langauage** : *Javascript*

**Framework** : *NodeJS & Express*

**Database** : *MongoDB(Atlas)*

**Developer** : *Shashank Tyagi*

### Steps To Be Followed

##### Step 1 - ***Clone the project using following command :***
    git clone <repo_url>

##### Step 2 - ***Setup your .env file by adding two keys in it :***

    MONGO_CONNECTION_URL =

    SECRET_KEY =

##### ***Step 3 - In the project directory, run:***
    1. npm install (this install all the required node pacakages)
    2. npm run start (this runs your server locally on port 8800)



## API Reference

#### 1. Register New User

```http
POST /api/auth/register
```

| Parameter | Type     | 
| :-------- | :------- |
| `body` | `JSON` |
    "userName" : "Sample User",
    "password" : "Sample Password",
    "email" : "sample123@gmail.com",
    "isAdmin" : false

#### 2. Login New User

```http
POST /api/auth/login
```

| Parameter | Type     | 
| :-------- | :------- |
| `body` | `JSON` |
    "email" : "sample123@gmail.com",
    "password" : "Sample Password",

