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
