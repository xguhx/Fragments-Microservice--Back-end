# POST a new text fragment to http://localhost:8080 as an authorized user. The fragment's body should be the string, Hello S3!.
# Confirm that the server returns a 201, and capture the Location header value to a variable named url
# GET the fragment you just created using the url as an authorized user.
# Confirm that the server returns a 200, that the type of the fragment is text/plain, and that the body is equal to Hello S3!
# DELETE the fragment using the url as an authorized user.
# Confirm that the server returns a 200.
# Try to GET the fragment again using the url as an authorized user.
# Confirm that the server returns a 404, since the fragment should be deleted.

# ================================================================================================================

# Post Authorized text "Hello S3!"

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```Hello S3!```

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check 
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
# 9 is the length of our fragment data: 'Hello S3!'
jsonpath "$.fragment.size" == 9
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"


# ================================================================================================================
# Get the created fragment

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: text/plain

# ================================================================================================================
# Delete the created fragment

# 2. Try to Delete the fragment we just posted by its URL
DELETE {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200


# ================================================================================================================
#Try to get the deleted fragment

# 2. Try to Delete the fragment we just posted by its URL
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 404

