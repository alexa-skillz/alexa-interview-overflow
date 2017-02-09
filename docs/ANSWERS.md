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
