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
