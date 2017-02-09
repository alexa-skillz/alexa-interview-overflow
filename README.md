[![documentation](https://s3.amazonaws.com/technical-interview-alexa-skill/interview-overflow.png)](https://alexa-skills.gitbooks.io/alexa-interview-overflow/content/)


[![Build Status](https://travis-ci.org/alexa-skillz/alexa-interview-overflow.svg?branch=staging)](https://travis-ci.org/alexa-skillz/alexa-interview-overflow) ![alt img](https://david-dm.org/alexa-skillz/alexa-interview-overflow.svg) [![Coverage Status](https://coveralls.io/repos/github/alexa-skillz/alexa-interview-overflow/badge.svg?branch=add-availableforhire-data)](https://coveralls.io/github/alexa-skillz/alexa-interview-overflow?branch=add-availableforhire-data)

Gathering user-generated interview questions and answers for our Alexa interview skill(s).

Check out our InVision mockup of our MVP [here](https://invis.io/ENAA20CAJ#/214267908_Interview_Overflow_-3--pdf_1).

Checkout out our Landing Page: [Staging](https://staging-interview-overflow.herokuapp.com/) | [Production](https://alexa-interview-overflow.herokuapp.com/)

----

<p align="center">[View Docs](https://alexa-skills.gitbooks.io/alexa-interview-overflow/content/)</p>

## Submit Interview Questions and Answers on Interview Overflow

If you want to submit questions and answers, log into our Interview Overflow app. From there, our developers will pick and choose the best questions and answers to include in our Alexa skills. You can up vote, down vote, add questions, and add answers to this app. You can also update questions and answers.

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
MONGO_URI='mongodb://<your_db_username>:<your_db_password>@ds157288.mlab.com:57288/alexa'
APP_SECRET='coolsecret'
```

These are your environment variables. Be sure to add your `.env` file to your `.gitignore` since you want to keep this information secret. Shhh...

You will now see the phrase "server is up at port: 3000" if you have not already specified a port number.

## SignUp
### Test the API (POST)

1. Open a new terminal located at the root of this project and type `http POST :3000/api/signup username="user2" password="password2" email="testing2@test.com"`
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

1. Make a GET request, like this example: `http GET :3000/api/signin -a user3:password3` since
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

1. Open a new terminal located at the root of this project, grab the token, and type `http POST :3000/api/question content="What is this?" Authentication:"Bearer <long-token-string>"` Note: the single space after "Bearer" in that line is important.
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

### Test the API (GET All Questions)

To GET a list of all questions sorted in the order they are created, do the following:

1. Make a GET request, like this example: `http :3000/api/question/`. NOTE: You do not need your token for this request.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 271
Content-Type: application/json; charset=utf-8
Date: Sun, 08 Jan 2017 23:24:46 GMT
ETag: W/"10f-V4YbpwjRpYDgg9+KAMuF4A"
X-Powered-By: Express

[
  "5872c99fb5c9e5247518d508",
  "5872c98352171523b5655eac",
  "5872c97752171523b5655eab",
  "5872c96952171523b5655eaa",
  "5872c888cdadcf22f0c67961",
  "5872c875cdadcf22f0c67960",
  "5872c83256bfac22694be899",
  "5872bd2aec2c4d1f189d1cf2",
  "5871af18dbd6fa7ff8f49344",
  "5871a3f83868de75ee8456e1"
]
```

### Test the API (GET a Specific Question)

After making a POST, you can make a GET request by grabbing the `_id` from the POST request and adding it as a param to the url.

1. Make a GET request, like this example: `http :3000/api/question/5871a3f83868de75ee8456e1`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 105
Content-Type: application/json; charset=utf-8
Date: Sun, 08 Jan 2017 21:11:46 GMT
ETag: W/"69-4W3FOGa7pgTVxmlJvUQHfQ"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5872ab02ee1492148dabdee3",
    "content": "What is this?",
    "created": "2017-01-08T21:11:30.839Z"
}
```

### Test the API (PUT)

After making a POST, you can make a PUT request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a PUT request, like this example: `http PUT :3000/api/question/5872ab02ee1492148dabdee3 content="updated" Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 99
Content-Type: application/json; charset=utf-8
Date: Sun, 08 Jan 2017 21:12:15 GMT
ETag: W/"63-pk1qDVC613Kbd2w0Qyp5Og"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5872ab02ee1492148dabdee3",
    "content": "updated",
    "created": "2017-01-08T21:11:30.839Z"
}
```

### Test the API (PUT) - Upvote / Downvote Questions

After making a POST, you can make a PUT request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a PUT request to upvote or downvote on a question, like this example: `http PUT :3000/api/question/589a1ad8c6e4b429720a8bb7/upvote Authentication:"Bearer <long-token-string>"` or `http PUT :3000/api/question/589a1ad8c6e4b429720a8bb7/downvote Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 99
Content-Type: application/json; charset=utf-8
Date: Sun, 08 Jan 2017 21:12:15 GMT
ETag: W/"63-pk1qDVC613Kbd2w0Qyp5Og"
X-Powered-By: Express

{
  "__v": 0,
    "_id": "589a1ad8c6e4b429720a8bb7",
    "answersArray": [],
    "content": "hey",
    "created": "2017-02-07T19:07:04.630Z",
    "userID": "589a1a92c6e4b429720a8bb6",
    "votes": -1
}
```

The upvotes and downvotes will increment or decrement the number of votes associated with the question.

### Test the API (DELETE Question)

After making a POST, you can make a DELETE request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Be sure to have your token.

1. Make a DELETE request, like this example: `http DELETE :3000/api/question/589a1ad8c6e4b429720a8bb7 Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `204` status code, like this example:

``` javascript
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Connection: keep-alive
Date: Thu, 12 Jan 2017 22:03:41 GMT
X-Powered-By: Express
```

3. If you make another GET request to this particular id param, you will get a `404` status code, like this example:

``` javascript
HTTP/1.1 404 Not Found
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 13
Content-Type: text/html; charset=utf-8
Date: Thu, 12 Jan 2017 22:04:08 GMT
ETag: W/"d-8ImJlDOBcq5A9PkBq5sbQw"
X-Powered-By: Express

NotFoundError
```

## Answers
### Test the API (POST Answer)

1. Open a new terminal located at the root of this project, grab the token, and type `http POST :3000/api/question/<questionID>/answer content="This is answer" Authentication:"Bearer <long-token-string>"`
2. You should get a JSON response with a `200` status code and a response, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 196
Content-Type: application/json; charset=utf-8
Date: Thu, 12 Jan 2017 21:45:07 GMT
ETag: W/"c4-ZJkURxo8UkWIqR0wDmlqXw"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5877f8e3f33b6d17a2ecd131",
    "content": "This is an answer",
    "created": "2017-01-12T21:45:07.218Z",
    "questionID": "5877f880f33b6d17a2ecd130",
    "updated": "2017-01-12T21:45:07.218Z",
    "votes": 0
}
```

### Test the API (GET All Answers)

To GET a list of all answers sorted in the order they are created, do the following:

1. Make a GET request, like this example: `http :3000/api/answer/`. NOTE: You do not need to send your token for this request.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 82
Content-Type: application/json; charset=utf-8
Date: Thu, 12 Jan 2017 21:50:31 GMT
ETag: W/"52-RWTjDUXVi5LSIPVCSi53oQ"
X-Powered-By: Express

[
    "5877f8e3f33b6d17a2ecd131",
    "5877f8fff33b6d17a2ecd132",
    "5877f910f33b6d17a2ecd133"
]

```

### Test the API (GET a Specific Answer)

After making a POST, you can make a GET request by grabbing the `_id` from the POST request and adding it as a param to the url.

1. Make a GET request, like this example: `http :3000/api/answer/5877f8e3f33b6d17a2ecd131`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 196
Content-Type: application/json; charset=utf-8
Date: Thu, 12 Jan 2017 21:53:59 GMT
ETag: W/"c4-7dX65goJ54fYJ4aBh9IulA"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5877f8e3f33b6d17a2ecd131",
    "content": "This is an answer",
    "created": "2017-01-12T21:45:07.218Z",
    "questionID": "5877f880f33b6d17a2ecd130",
    "updated": "2017-01-12T21:45:07.218Z",
    "votes": 0
}
```

### Test the API (PUT)

After making a POST, you can make a PUT request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a PUT request, like this example: `http PUT :3000/api/answer/5877f8e3f33b6d17a2ecd131 content="Updated an answer." Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 197
Content-Type: application/json; charset=utf-8
Date: Thu, 12 Jan 2017 22:02:09 GMT
ETag: W/"c5-WOTt43ZNUQk1IHelajezFg"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5877f8e3f33b6d17a2ecd131",
    "content": "Updated an answer.",
    "created": "2017-01-12T21:45:07.218Z",
    "questionID": "5877f880f33b6d17a2ecd130",
    "updated": "2017-01-12T21:45:07.218Z",
    "votes": 0
}
```

### Test the API (PUT) - Upvote / Downvote Answers

After making a POST, you can make a PUT request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a PUT request to upvote or downvote on an answer, like this example: `http PUT :3000/api/answer/589a1e50b03eeb2b1820796c/upvote Authentication:"Bearer <long-token-string>"` or `http PUT :3000/api/answer/589a1e50b03eeb2b1820796c/downvote Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 99
Content-Type: application/json; charset=utf-8
Date: Sun, 08 Jan 2017 21:12:15 GMT
ETag: W/"63-pk1qDVC613Kbd2w0Qyp5Og"
X-Powered-By: Express

{
  "__v": 0,
    "_id": "589a1ad8c6e4b429720a8bb7",
    "answersArray": [],
    "content": "hey",
    "created": "2017-02-07T19:07:04.630Z",
    "userID": "589a1a92c6e4b429720a8bb6",
    "votes": -1
}
```

The upvotes and downvotes will increment or decrement the number of votes associated with the answer.

### Test the API (DELETE)

After making a POST, you can make a DELETE request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Be sure to have your token.

1. Make a DELETE request, like this example: `http DELETE :3000/api/answer/5877f8e3f33b6d17a2ecd131 Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `204` status code, like this example:

``` javascript
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Connection: keep-alive
Date: Thu, 12 Jan 2017 22:03:41 GMT
X-Powered-By: Express
```

3. If you make another GET request to this particular id param, you will get a `404` status code, like this example:

``` javascript
HTTP/1.1 404 Not Found
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 13
Content-Type: text/html; charset=utf-8
Date: Thu, 12 Jan 2017 22:04:08 GMT
ETag: W/"d-8ImJlDOBcq5A9PkBq5sbQw"
X-Powered-By: Express

NotFoundError
```

## Profile
### Test the API (GET)

When a user sends a GET request to `:8000/api/profile/me`, profile will be created automatically with the first request and saves a profile to that user.

1. Make a GET request, like this example: `http GET :3000/api/profile/me Authentication:"Bearer <long-token-string>"`. Be sure to include your token.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 140
Content-Type: application/json; charset=utf-8
Date: Thu, 12 Jan 2017 22:12:48 GMT
ETag: W/"8c-JLUsuAYGScZK+WnBoC1CsQ"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5877ff60f33b6d17a2ecd134",
    "availableForHire": false,
    "created": "2017-01-12T22:12:48.951Z",
    "userID": "5877f84ff33b6d17a2ecd12f"
}
```

### Test the API (PUT)

After the initial GET, you can make a PUT request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a PUT request, like this example: `http PUT :3000/api/profile/me bio="I love writing code" Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `200` status code, like this example:

```javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 169
Content-Type: application/json; charset=utf-8
Date: Thu, 12 Jan 2017 23:06:45 GMT
ETag: W/"a9-dqF7oDEWjYPdAuBz173uLA"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "5877ff60f33b6d17a2ecd134",
    "availableForHire": false,
    "bio": "I love writing code.",
    "created": "2017-01-12T22:12:48.951Z",
    "userID": "5877f84ff33b6d17a2ecd12f"
}
```

## Future Work / Ideas

* Implement an Angular frontend to Interview Overflow
* Integrate Alexa into our web application
* Allow users to log into the Interview Overflow app via their Amazon accounts
* Create a more robust profile endpoint

## Thank You
 Thank you to [Brian Nations](@bnates), [Gio D'Amelio](@giodamelio), [Kaylyn Yuh](@kaylynyuh), [Duncan Marsh](@slugbyte), and [Lee Broxson](@broxsonl). Also to the [Amazon Alexa SDK](https://developer.amazon.com/alexa) and the [Stack Exchange API](https://api.stackexchange.com/)
