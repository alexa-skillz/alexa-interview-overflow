## Answers
### Test the API (POST Answer)

1. Open a new terminal located at the root of this project, grab the token, and type ` http POST :3000/questions/589f936c8076134eea917d10/answers content="Answer 1" Authentication:"Bearer <long-token-string>"`
2. You should get a JSON response with a `200` status code and a response, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 518
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 23:16:54 GMT
ETag: W/"206-n2WfSjX580KWlShBa7GtpQ"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "589f9b66dca5d155d14ecc98",
    "content": "Answer 1",
    "created": "2017-02-11T23:16:54.690Z",
    "downvotes": 0,
    "question": {
        "__v": 1,
        "_id": "589f936c8076134eea917d10",
        "answers": [
            "589f9b66dca5d155d14ecc98"
        ],
        "content": "Where are we?",
        "created": "2017-02-11T22:42:52.963Z",
        "downvotes": 0,
        "updated": "2017-02-11T22:42:52.963Z",
        "upvotes": 1,
        "usersWhoDownvoted": [],
        "usersWhoUpvoted": [
            "589f92cec62f224e0688e63c"
        ]
    },
    "updated": "2017-02-11T23:16:54.690Z",
    "upvotes": 1,
    "usersWhoDownvoted": [],
    "usersWhoUpvoted": [
        "589f92cec62f224e0688e63c"
    ]
}
```

### Test the API (PUT)

After making a POST, you can make a PUT request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a PUT request, like this example: `http PUT :3000/api/questions/58a1f6c4c930303f08d2c6ce/answers/58a1f6c4c930303f08d2c6ce content="test answer" Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 485
Content-Type: application/json; charset=utf-8
Date: Mon, 13 Feb 2017 18:11:16 GMT
ETag: W/"1e5-U1SuZ5drQujxr4LGoMqdaA"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "58a1f6c4c930303f08d2c6ce",
    "content": "who?",
    "created": "2017-02-13T18:11:16.009Z",
    "downvotes": 0,
    "question": {
        "__v": 5,
        "_id": "58a1f5bac930303f08d2c6cd",
        "answers": [
            "58a1f6c4c930303f08d2c6ce"
        ],
        "content": "test answer",
        "created": "2017-02-13T18:06:50.612Z",
        "downvotes": 0,
        "updated": "2017-02-13T18:06:50.612Z",
        "upvotes": 0,
        "usersWhoDownvoted": [],
        "usersWhoUpvoted": []
    },
    "updated": "2017-02-13T18:11:16.009Z",
    "upvotes": 1,
    "usersWhoDownvoted": [],
    "usersWhoUpvoted": [
        "58a1f539c930303f08d2c6cb"
    ]
}
```

### Test the API (PUT) - Upvote / Downvote Answers

After making a POST, you can make a PUT request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a PUT request to upvote or downvote on an answer, like this example: `http PUT :3000/questions/589f936c8076134eea917d10/answers/589f9b66dca5d155d14ecc98/upvote Authentication:"Bearer <long-token-string>"` or `http PUT :3000/questions/589f936c8076134eea917d10/answers/589f9b66dca5d155d14ecc98/downvote Authentication:"Bearer <long-token-string>"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 267
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 23:23:49 GMT
ETag: W/"10b-gAMd/ewWNBq0Xir9whieRg"
X-Powered-By: Express

{
    "__v": 2,
    "_id": "589f9b66dca5d155d14ecc98",
    "content": "answer",
    "created": "2017-02-11T23:16:54.690Z",
    "downvotes": 0,
    "question": "589f936c8076134eea917d10",
    "updated": "2017-02-11T23:16:54.690Z",
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
Content-Length: 267
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 23:25:35 GMT
ETag: W/"10b-uR4Gh5PrVX+kRsIwdRa4vw"
X-Powered-By: Express

{
    "__v": 3,
    "_id": "589f9b66dca5d155d14ecc98",
    "content": "answer",
    "created": "2017-02-11T23:16:54.690Z",
    "downvotes": 1,
    "question": "589f936c8076134eea917d10",
    "updated": "2017-02-11T23:16:54.690Z",
    "upvotes": 0,
    "usersWhoDownvoted": [
        "589f92cec62f224e0688e63c"
    ],
    "usersWhoUpvoted": []
}
```

The upvotes and downvotes will increment or decrement the number of votes associated with the answer.

### Test the API (DELETE)

After making a POST, you can make a DELETE request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Be sure to have your token.

1. Make a DELETE request, like this example: `http DELETE :3000/api/questions/58a1f6c4c930303f08d2c6ce/answer/5877f8e3f33b6d17a2ecd131 Authentication:"Bearer <long-token-string>"`.

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
