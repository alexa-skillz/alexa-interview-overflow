![alt img](https://travis-ci.org/alexa-skillz/alexa-interview-overflow.svg?branch=staging) ![alt img](https://david-dm.org/alexa-skillz/alexa-interview-overflow.svg) [![Coverage Status](https://coveralls.io/repos/github/alexa-skillz/alexa-interview-overflow/badge.svg)](https://coveralls.io/github/alexa-skillz/alexa-interview-overflow)

# Interview Overflow
Gathering user-generated interview questions and answers for our Alexa interview skill(s).

## Submit Interview Questions and Answers on Interview Overflow

If you want to submit questions and answers, log into our Interview Overflow app. From there, our developers will pick and choose the best questions and answers to include in our Alexa skills. You can up vote, down vote, add questions, and add answers to this app. You can also update and delete questions and answers.

### Get the Project Running

First, install MongoDB. The instructions are [here](https://docs.mongodb.com/manual/installation/).

Now, type the following in your command line:

1. `git clone https://github.com/alexa-skillz/alexa-interview-overflow.git`
2. `cd alexa-interview-overflow.git`
3. `npm install`
4. `brew install httpie`
5. Go to [MLab](https://mlab.com/) and set up an account following [these instructions](http://www.nightscout.info/wiki/welcome/configuring-the-data-backend)
6. Open another terminal and type: `mongod`
7. Open yet another terminal and type: `npm start`
8. Add a `.env` file to the root directory of this lab and add something similar to following (you will get your MLab URI, database username, and database password from your MLab account):

```
PORT='3000'
MLAB_MONGO_URI='mongodb://<your_db_username>:<your_db_password>@ds157288.mlab.com:57288/alexa'
```

These are your environment variables. Be sure to add your `.env` file to your `.gitignore` since you want to keep this information secret. Shhh...

You will now see the phrase "server is up at port: 3000" if you have not already specified a port number.

## SignUp
### Test the API (POST)

1. Open a new terminal located at the root of this project and type `http POST localhost:3000/api/signup username="user2" password="password2" email="testing2@test.com"`
2. You should get a JSON response with a `200` status code, and a token for future authentication, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 205
Content-Type: text/html; charset=utf-8
Date: Tue, 03 Jan 2017 19:03:41 GMT
ETag: W/"cd-vJLWlT+ADjDgdcMElCLuPA"
X-Powered-By: Express

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImQ4OTM4M2E2ZjM1OGYyMWUyY2UwNGY3N2E5YjNhOGJjMDcwODU3YjkzNGU3NGMwOWJjZTllM2UzN2IyZjdhNDMiLCJpYXQiOjE0ODM1MDUxNjd9.wBf9SkzdSXOaBb1CA1ajk0n2EYNvrmhOrGhX16m-RJg
```

## SignIn
### Test the API (GET)

After making a POST, you can make a GET request by signing in.

1. Make a GET request, like this example: `http GET localhost:3000/api/signin -a user3:password3` since
upon splitting off the end of the Basic base64 string, we can transform this into a UTF-8 string and grab the username and password as they are now available and split with a : --
ex: username:password. The `-a` allows for authorization, as explained [here](http://blog.mashape.com/postman-httpie-test-apis/).

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 205
Content-Type: text/html; charset=utf-8
Date: Tue, 03 Jan 2017 19:40:46 GMT
ETag: W/"cd-OBWf8LruAeFgYeDnItRDkw"
X-Powered-By: Express

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImQ4OTM4M2E2ZjM1OGYyMWUyY2UwNGY3N2E5YjNhOGJjMDcwODU3YjkzNGU3NGMwOWJjZTllM2UzN2IyZjdhNDMiLCJpYXQiOjE0ODM1MDUxNjd9.wBf9SkzdSXOaBb1CA1ajk0n2EYNvrmhOrGhX16m-RJg
```

## Questions
### Test the API (POST)

1. Open a new terminal located at the root of this project, grab the token, and type `http POST localhost:3000/api/questions content="What is this?"`
2. You should get a JSON response with a `200` status code and a response, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 105
Content-Type: application/json; charset=utf-8
Date: Sun, 08 Jan 2017 02:29:12 GMT
ETag: W/"69-TjkNa/AGllrNsPuAq7jBBg"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5871a3f83868de75ee8456e1",
    "content": "What is this?",
    "created": "2017-01-08T02:29:12.697Z"
}
```

### Test the API (GET)

After making a POST, you can make a GET request by grabbing the `_id` from the POST request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a GET request, like this example: `http localhost:3000/api/questions/5871a3f83868de75ee8456e1`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 145
Content-Type: application/json; charset=utf-8
Date: Wed, 04 Jan 2017 05:52:17 GMT
ETag: W/"91-KaSGTNMILzMoRXFQyGu19Q"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "586c7f5c7b26425f3c8f3dd0",
    "created": "2017-01-04T05:49:55.717Z",
    "desc": "description",
    "name": "meow",
    "userID": "586c7e0f7b26425f3c8f3dc7"
}
```
## Future Work / Ideas

* Implement an Angular frontend to Interview Overflow
* Integrate Alexa into our web application
* Allow users to log into the Interview Overflow app via their Amazon accounts

## Thank You
 Thank you to the Amazon Alexa SDK, Duncan, etc.
