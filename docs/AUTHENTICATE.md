## Register
### Test the API (POST)

1. Open a new terminal located at the root of this project and type `http POST :3000/register username="testuser" password="testpassword"`
2. You should get a JSON response with a `200` status code, and a token for future authentication, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 213
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 22:36:36 GMT
ETag: W/"d5-bt8Dl1GbEZG+BNPlfgzm9A"
X-Powered-By: Express

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODlmOTFmNGM2MmYyMjRlMDY4OGU2M2IiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNDkyMDMyOTk2LCJpYXQiOjE0ODY4NTI1OTZ9.ibiTsdPAqx_-KnpnNzt6sSTdEgzTLtEgDj2wZQKTmrU"
}
```

## Login
### Test the API (GET)

After making a POST, you can make a GET request by logging in.

1. Make a GET request, like this example: ` http POST :3000/login username="testuser" password="testpassword"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 213
Content-Type: application/json; charset=utf-8
Date: Sat, 11 Feb 2017 22:37:17 GMT
ETag: W/"d5-UA+EAL9Oo4wN+4juOWEpJQ"
X-Powered-By: Express

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODlmOTFmNGM2MmYyMjRlMDY4OGU2M2IiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNDkyMDMzMDM3LCJpYXQiOjE0ODY4NTI2Mzd9.G62Wgskw-aRYtZZpKYZRkVXjW3H0RDOZkp_csVv-kuY"
}
```
