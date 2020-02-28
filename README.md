# Purpose

typescript helps to avoid numerous errors at development time and for sure firebase is one of the most used tools among developers, be it for mobile, web projects and etc.

The biggest problem is that we have to force data types when we access them through the firebase and this can cause numerous errors.

The firestore-wrapper has the purpose of facilitating and speeding up the life of the developer, being necessary to type your database only once.

# How to use

## 1) Describe your database

In some file, describe your database using a typescript, look like this:

```
export interface Database {
    User: {[user_id: string]: User};
    Locations: {[location_name: string]: Locations};
}

interface User {
    name: string,
    email: string,
    nick: string
}

interface Locations {
    latitude: number;
    longitude: number;
    single: string;
}
```

## 2) Initialize your firebase-admin and associate with wapper

```
import * as firebase from "firebase-admin";
import Credentials from "../Credentials.json";
import { root } from "firestore-wrapper";
import databaseSchema from './database';

const firebaseSdk = firebase.initializeApp({
    credential: firebase.credential.cert(Credentials as firebase.ServiceAccount),
    databaseURL: "https://any-project.firebaseio.com"  
});

const db = root<databaseSchema>(firebaseSdk.firestore() as any);
```

## 3) Now, all firestore functions is typing with your database schema

While you access your database, the wrapper indicates if the path is right

![Specs](https://gist.githubusercontent.com/LeonBonetti/303d7f35aec2cd35a994fcef9d14dec2/raw/23c2341692ea45dcdff9298bd4821f07549ae1f5/access-collectiono-example.JPG)

When you retrieve data, he cames with right type

![Specs](https://gist.githubusercontent.com/LeonBonetti/303d7f35aec2cd35a994fcef9d14dec2/raw/9c40fe83bba329df13bca9b0fcc7f7f595fc1607/retrieve-data-example.JPG)

Even inside transactions, you keep the types

![Specs](https://gist.githubusercontent.com/LeonBonetti/303d7f35aec2cd35a994fcef9d14dec2/raw/927f49a86df2b23adef26575f8ab176995399c9c/transaction-example.JPG)