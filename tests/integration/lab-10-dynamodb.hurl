# POST a new JSON fragment to http://localhost:8080 as an authorized user. The fragment's body should be the JSON value, { "service": "DynamoDB" }.
# Confirm that the server returns a 201, and capture the Location header value and the fragment's id in variables named fragment1_url and fragment1_id.
# GET the fragment info (i.e., metadata) for the fragment you just created using the Location URL/info as an authorized user and confirm that the server returns a 200 and that all of the metadata properties match what you expect.
# POST a second Markdown fragment to http://localhost:8080 as the same authorized user. The fragment's body should be the Markdown value, DynamoDB is **great**..
# Confirm that the server returns a 201, and once again capture the Location header value and the second id in variables named fragment2_url and fragment2_id.
# GET the fragment info (i.e., metadata) you just created using the url/info as an authorized user and confirm that the server returns a 200 and that all of the metadata properties match what you expect.
# GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs) and confirm that the list of fragments includes the two id values you captured above
# DELETE the first fragment you created above
# Confirm that the server returns a 200
# Try to GET the first fragment again using the url you captured above as the authorized user.
# Confirm that the server returns a 404, since the fragment should be deleted.
# GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs) a second time, and confirm that the first id is NOT included but that the second id is (i.e., that the second was deleted).

# ================================================================================================================

# Post Authorized JSON "{ "service": "DynamoDB" }"

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a JSON fragment
Content-Type: application/json
# Body of the request goes in { } when it's a JSON
{ 
  "service": "DynamoDB" 
}

# 1. We expect to get back an HTTP 201
HTTP/1.1 201

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
jsonpath "$.fragment.type" == "application/json"
# Capture the Location URL into a variable named `url`
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"


# ================================================================================================================
# Get the created fragment

# 2. Try to GET the fragment metadata we just posted by its URL/Info
GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

[Asserts]

jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"


# ================================================================================================================

# Post Authorized Markdown "DynamoDB is **great**."

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a tesxt/Markdown fragment
Content-Type: text/markdown
# Body of the request goes in ```...``` when it's a string
```DynamoDB is **great**.```


# 1. We expect to get back an HTTP 201
HTTP/1.1 201

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
jsonpath "$.fragment.type" == "text/markdown"
# Capture the Location URL into a variable named `url`
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"


# ================================================================================================================
# Get the created fragment

# 2. Try to GET the fragment metadata we just posted by its URL/Info
GET {{fragment2_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

[Asserts]

jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString




# =================================================================================================================


# Get list of fragments

GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

[Asserts]
# The Location header should look like what we expect (including the fragment id)
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid

jsonpath "$.fragments" count == 2
jsonpath "$.fragments[0]" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragments[0]" == {{fragment1_id}}
jsonpath "$.fragments[1]" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragments[1]" == {{fragment2_id}}


# ================================================================================================================

# Try Delete the first fragment

# 2. Try to DELETE the first fragment by its URL
DELETE {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# Getting 400 here, Why?
HTTP/1.1 200



# =================================================================================================================

# Try to get the deleted fragment

GET {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 404

# ================================================================================================================

# Get list of fragments

GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

[Asserts]
# The Location header should look like what we expect (including the fragment id)
jsonpath "$.status" == "ok"


jsonpath "$.fragments" count == 1
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragments[0]" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragments[0]" != {{fragment1_id}}
jsonpath "$.fragments[0]" == {{fragment2_id}}
