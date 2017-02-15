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
