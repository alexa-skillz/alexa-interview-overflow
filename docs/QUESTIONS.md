## Questions
### Test the API (POST)

1. Open a new terminal located at the root of this project, grab the token, and type `http POST :3000/api/question content="What is this?" Authentication:"Bearer <long-token-string>"` Note: the single space after "Bearer" in that line is important.
2. You should get a JSON response with a `200` status code and a response, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 244
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 22:41:15 GMT
ETag: W/"f4-LXjYEHB1Ue6WBDIp+otgtw"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "589f930b8076134eea917d0f",
    "answers": [],
    "content": "What is this?",
    "created": "2017-02-11T22:41:15.781Z",
    "downvotes": 0,
    "updated": "2017-02-11T22:41:15.781Z",
    "upvotes": 1,
    "usersWhoDownvoted": [],
    "usersWhoUpvoted": [
        "589f92cec62f224e0688e63c"
    ]
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
Content-Length: 498
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 22:43:02 GMT
ETag: W/"1f2-XWkwu/T/USzZ0dxLlGKufQ"
X-Powered-By: Express

[
    {
        "__v": 0,
        "_id": "589f930b8076134eea917d0f",
        "answers": [],
        "content": "What is this?",
        "created": "2017-02-11T22:41:15.781Z",
        "downvotes": 0,
        "updated": "2017-02-11T22:41:15.781Z",
        "upvotes": 1,
        "usersWhoDownvoted": [],
        "usersWhoUpvoted": [
            "589f92cec62f224e0688e63c"
        ]
    },
    {
        "__v": 0,
        "_id": "589f936c8076134eea917d10",
        "answers": [],
        "content": "Where are we?",
        "created": "2017-02-11T22:42:52.963Z",
        "downvotes": 0,
        "updated": "2017-02-11T22:42:52.963Z",
        "upvotes": 1,
        "usersWhoDownvoted": [],
        "usersWhoUpvoted": [
            "589f92cec62f224e0688e63c"
        ]
    }
]
```

### Test the API (GET a Specific Question)

After making a POST, you can make a GET request by grabbing the `_id` from the POST request and adding it as a param to the url.

1. Make a GET request, like this example: `http :3000/api/question/589f930b8076134eea917d0f`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 244
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 22:43:53 GMT
ETag: W/"f4-uXi6JuzKdnxPGJ4hRWSYfw"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "589f930b8076134eea917d0f",
    "answers": [],
    "content": "What is this?",
    "created": "2017-02-11T22:41:15.781Z",
    "downvotes": 0,
    "updated": "2017-02-11T22:41:15.781Z",
    "upvotes": 1,
    "usersWhoDownvoted": [],
    "usersWhoUpvoted": [
        "589f92cec62f224e0688e63c"
    ]
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

1. Make a PUT request to upvote or downvote on a question, like this example: `http PUT :3000/api/question/589f930b8076134eea917d0f/upvote Authentication:"Bearer <long-token-string>"` or `http PUT :3000/api/question/589f930b8076134eea917d0f/downvote Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 244
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 22:45:55 GMT
ETag: W/"f4-TqCXg80cUGs2y5c1Kt6B9g"
X-Powered-By: Express

{
    "__v": 4,
    "_id": "589f930b8076134eea917d0f",
    "answers": [],
    "content": "What is this?",
    "created": "2017-02-11T22:41:15.781Z",
    "downvotes": 0,
    "updated": "2017-02-11T22:41:15.781Z",
    "upvotes": 1,
    "usersWhoDownvoted": [],
    "usersWhoUpvoted": [
        "589f92cec62f224e0688e63c"
    ]
}
```

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 244
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 22:47:13 GMT
ETag: W/"f4-LFh6dCXXqi+5kRnyJzjLUQ"
X-Powered-By: Express

{
    "__v": 5,
    "_id": "589f930b8076134eea917d0f",
    "answers": [],
    "content": "What is this?",
    "created": "2017-02-11T22:41:15.781Z",
    "downvotes": 1,
    "updated": "2017-02-11T22:41:15.781Z",
    "upvotes": 0,
    "usersWhoDownvoted": [
        "589f92cec62f224e0688e63c"
    ],
    "usersWhoUpvoted": []
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
