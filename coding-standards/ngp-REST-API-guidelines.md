# REST

Representational state transfer (REST) is a software architectural style that defines a set of constraints to be used for creating Web services. Web services that conform to the REST architectural style, called RESTful Web services, provide interoperability between computer systems on the Internet. RESTful Web services allow the requesting systems to access and manipulate textual representations of Web resources by using a uniform and predefined set of stateless operations. Other kinds of Web services, such as SOAP Web services, expose their own arbitrary sets of operations

# Terminologis

## Resource

The key abstraction of information in REST is a resource. Any information that can be named can be a resource: a document or image, a temporal service (e.g. "today's weather in Los Angeles"), a collection of other resources, a non-virtual object (e.g. a person), and so on. A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time.A resource can also map to the empty set, that allows references to be made to a concept before any realization of that concept exists

## Service

Services provide a generic API for accessing and manipulating the value set of a resource. Services are generic pieces of software that can perform any number of functions.

## Client, API Client, API Consumer

An entity that invokes an API request and consumes the API response.

# HTTP Methods

The HTTP protocol defines a number of methods that assign semantic meaning to a request. The common HTTP methods used by most RESTful web APIs are:

- **GET** retrieves a representation of the resource at the specified URI. The body of the response message contains the details of the requested resource.
- **POST** creates a new resource at the specified URI. The body of the request message provides the details of the new resource. Note that POST can also be used to trigger operations that don't actually create resources.
- **PUT** updates the resource at the specified URI. The body of the request message specifies the resource to be updated.
- **PATCH** performs a partial update of a resource. The request body specifies the set of changes to apply to the resource.
- DELETE removes the resource at the specified URI.

# Guidelines

## Resource Naming

- A **resource can be a singleton or a collection**. For example, “customers�? is a collection resource and “customer�? is a singleton resource (in a banking domain). We can identify “customers�? collection resource using the URI `/customers`. We can identify a single “customer�? resource using the URI `/customers/{customerId}`.
- A resource may contain sub-collection resources also. For example, sub-collection resource “accounts�? of a particular “customer�? can be identified using the URN `/customers/{customerId}/accounts` (in a banking domain). Similarly, a singleton resource “account�? inside the sub-collection resource “accounts�? can be identified as follows: `/customers/{customerId}/accounts/{accountId}`.
- REST API’s should be designed for Resources, which can be entities or services, etc., therefore they must always be nouns.
  For example, instead of /createUser use /users

## Utilize Proper HTTP Methods - Let the method verbs define the actions

The effect of a specific request should depend on whether the resource is a collection or an individual item. The following table summarizes the common conventions adopted by most RESTful implementations using the e-commerce example. Not all of these requests might be implemented—it depends on the specific scenario.

| Resource              | POST                                      | GET                                         | PUT                                                   | DELETE                                   |
| --------------------- | ----------------------------------------- | ------------------------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| `/customers`          | Create a new customer                     | Retrieve all customers                      | Error                                                 | Remove all customers                     |
| `/customers/1`        | Error                                     | Retrieve the details for customer with id 1 | Update the details of customer with id 1 if it exists | Remove customer with id 1                |
| `/customers/1/orders` | Create a new order for customer with id 1 | Retrieve all orders for customer with 1     | Bulk update of orders for customer with id 1          | Remove all orders for customer with id 1 |

The differences between POST, PUT, and PATCH can be confusing.

- A POST request creates a resource. The server assigns a URI for the new resource, and returns that URI to the client. In the REST model, you frequently apply POST requests to collections. The new resource is added to the collection. A POST request can also be used to submit data for processing to an existing resource, without any new resource being created.
- A PUT request updates an existing resource. The client specifies the URI for the resource. The request body contains a complete representation of the resource. If a resource with this URI already exists, it is replaced. Otherwise a new resource is created, if the server supports doing so. PUT requests are most frequently applied to resources that are individual items, such as a specific customer, rather than collections. A server might support updates but not creation via PUT. Whether to support creation via PUT depends on whether the client can meaningfully assign a URI to a resource before it exists. If not, then use POST to create resources and PUT or PATCH to update.

A PATCH request performs a partial update to an existing resource. The client specifies the URI for the resource. The request body specifies a set of changes to apply to the resource. This can be more efficient than using PUT, because the client only sends the changes, not the entire representation of the resource. Technically PATCH can also create a new resource (by specifying a set of updates to a "null" resource), if the server supports this.

## Don’t Misuse Safe Methods (Idempotency)

Safe methods are HTTP methods which return the same resource representation irrespective of how many times are called by client.
GET, HEAD, OPTIONS and TRACE methods are defined as safe, meaning they are only intended for retrieving data and should not change a state of a resource on a server.

Don’t use GET to delete content, for example...
`GET /users/123/delete`
It’s not like this can’t be implemented, but HTTP specificationis violated in this case.

Use HTTP methods according to the action which needs to be performed.

## Depict Resource Hierarchy Through URI

If a resource contains sub-resources, make sure to depict this in the API to make it more explicit.
For example, if a user has posts and we want to retrieve a specific post by user, API can be defined as `GET /users/123/posts/1` which will retrieve Post with id 1 by user with id 123

## Conform to Semantics

### GET methods

A successful GET method typically returns HTTP status code 200 (OK). If the resource cannot be found, the method should return 404 (Not Found).

### POST methods

If a POST method creates a new resource, it returns HTTP status code 201 (Created). The URI of the new resource is included in the Location header of the response. The response body contains a representation of the resource.
If the method does some processing but does not create a new resource, the method can return HTTP status code 200 and include the result of the operation in the response body. Alternatively, if there is no result to return, the method can return HTTP status code 204 (No Content) with no response body.
If the client puts invalid data into the request, the server should return HTTP status code 400 (Bad Request). The response body can contain additional information about the error.

### PUT methods

If the method updates an existing resource, it returns either 200 (OK) or 204 (No Content).
In some cases, it might not be possible to update an existing resource. In that case, consider returning HTTP status code 409 (Conflict).
In case the requested resource does not exists, it returns 404 (Not Found).

### PATCH methods

With a PATCH request, the client sends a set of updates to an existing resource, in the form of a patch document. The server processes the patch document to perform the update. The patch document doesn't describe the whole resource, only a set of changes to apply.
JSON is probably the most common data format for web APIs.

For example, suppose the original resource has the following JSON representation:

```javascript
{
    "name":"gizmo",
    "category":"widgets",
    "color":"blue",
    "price":10,
    "size":"large"
}
```

Here is a possible JSON merge patch for this resource:

```javascript
{
    "price":12,
    "color":null,
    "size":"small"
}
```

This tells the server to update price, set color to null, and add size, while name and category are not modified.
Here are some typical error conditions that might be encountered when processing a PATCH request, along with the appropriate HTTP status code.

| Error condition                                                                                     | HTTP status code             |
| --------------------------------------------------------------------------------------------------- | ---------------------------- |
| The patch document format isn't supported.                                                          | 415 (Unsupported Media Type) |
| Malformed patch document.                                                                           | 400 (Bad Request)            |
| The patch document is valid, but the changes can't be applied to the resource in its current state. | 409 (Conflict)               |

### DELETE methods

If the delete operation is successful, the web server should respond with HTTP status code 204, indicating that the process has been successfully handled, but that the response body contains no further information. If the resource doesn't exist, the web server can return HTTP 404 (Not Found).

```HTTP
HTTP/1.1 202 Accepted
Location: /api/status/12345
```

If the client sends a GET request to this endpoint, the response should contain the current status of the request. Optionally, it could also include an estimated time to completion or a link to cancel the operation

```
HTTP/1.1 200 OK
Content-Type: application/json
{
    "status":"In progress",
    "link": { "rel":"cancel", "method":"delete", "href":"/api/status/12345" }
}
```

If the asynchronous operation creates a new resource, the status endpoint should return status code 303 (See Other) after the operation completes. In the 303 response, include a Location header that gives the URI of the new resource:

```
HTTP/1.1 303 See Other
Location: /api/orders/12345
```

## Filter and paginate data

Don’t create different URIs for fetching resources with filtering, searching, or sorting parameters. Try to keep the URI simple, and add query parameters to depict parameters or criteria to fetch a resource (single type of resource)

### Filtering:

Use query parameters defined in URL for filtering a resource from server. For example, if we would like to fetch all published posts by user you can design an API such as:
`GET /users/123/posts?state=published`

In the example above, state is the filter parameter.

Multiple filters result in an implicit **AND**. So the following example should not return any value.
`GET /users/123/posts?id=1&id=2`

**IN** operations are available for single fields, using comma-separated options for the field value and colon separation for the _in_ operator. The value must be in the list of values provided for the query to succeed.:
`GET /users/123/posts?id=in:1,2`

If values contain commas, they can be quoted similar to CSV escaping. For example, a query for the value `a,bc` or `d` would be `?foo=in:"a,bc",d`.

If values contain double-quotes, those can be backslashed inside quotes. Newline (“n�?) and carriage return (“r�?) escapes are also allowed.

Actual backslashes must be doubled. For a value `a"b\c` the query would be `?foo="a\"b\\c"`.
Unquoted values may not contain quotes and backslashes are treated as any other character. So for a value _a\b_ the query would be `?foo=a\b`.

For queries that need comparisons other than simple equals, operators are supported for membership, non-membership, inequality, greater-than, greater-than-or-equal, less-than, and less-than-or-equal-to. In order, the operators are: `in`, `nin`, `neq`, `gt`, `gte`, `lt`, and `lte`. Simple equality is the default operation, and is performed as `?param=foo`. They can be used in compounded queries like searching for user posts which have rating greater than 3.
`GET /users/123/posts?rating=gt:3`

It’s very common today for Elasticsearch to be used as search tool as it provides advanced capabilities to search for a document and you can design your API such as:

`GET /users/123/posts?q=sometext&fq=state:published,tag:scala`

This will search posts for free text “sometext�?(q) and filter results on `fq` state as published and having tag Scala.

### Sorting:

ASC and DESC sorting parameters can be passed in URL such as:

**GET /users/123/posts?sort=updated_at:asc**

**GET /users/123/posts?sort=updated_at:desc**

Returns posts sorted with descending order of update date time.At any point if sort direction is not specified, fallback to the defaults(desc).

In cases where sort needs to be done on more than one fields, use comma seperated list

**GET /users/123/posts?sort=updated_at:desc,created_at**

Order of sort to be applied will be based on the same order in which the fields are present in comma seperated list.

### Paging:

Use limit and offset. It is flexible for the user and common in leading databases.
**GET /users?offset=10&limit=5**
To send the total entries back to the user use the custom HTTP header: X-Total-Count.
Links to the next or previous page could be provided in the HTTP header link as well. It could be helpful to follow this link header values instead of constructing your own URLs.

## Stateless Authentication & Authorization

REST APIs should be stateless.

Every request should be self-sufficient and must be fulfilled without knowledge of the prior request. This happens in the case of Authorizing a user action.

Previously, developers stored user information in server-side sessions, which is not a scalable approach. For that reason, every request should contain all the information of a user (if it’s a secure API), instead of relying on previous requests.

This doesn’t limit APIs to a user as an authorized person, as it allows service-to-service authorization as well. For user authorization, JWT (JSON Web Token) with OAuth2 provides a way to achieve this. Additionally, for service-to-service communication, try to have the encrypted API-key passed in the header.

## Swagger for Documentation

Swagger is a widely-used tool to document REST APIs that provides a way to explore the use of a specific API, therefore allowing developers to understand the underlying semantic behavior. It’s a declarative way of adding documentation using annotations which further generates a JSON describing APIs andtheir usage.

Use Open API Spec documentation for creation of the Spec and use auto code generation to generate the server side stub and angular client library.

## Version Your APIs

Versioning APIs always helps to ensure backward compatibility of a service while adding new features or updating existing functionality for new clients.

There are different schools of thought to version your API, but most of them fall under two categories below:

### Headers:

There are 2 ways you can specify version in headers:

#### Custom Header:

Adding a custom _X-API-VERSION_(or any other header of choice) header key by client can be used by a service to route a request to the correct endpoint

#### Accept Header

Using accept header to specify your version such as
_=> Accept:application/vnd.hashmapinc.v2+json_

### URL(Suggested way):

Embed the version in the URL such as
**POST /v2/users**

## When should you use Path Variable, and how about Query Parameter?

If you want to identify a resource, you should use Path Variable. But if you want to sort or filter items, then you should use query parameter.
Example:
**/users** # Fetch a list of users
**/users?occupation=programer** # Fetch a list of programer user
**/users/123** # Fetch a user who has id 123

## Use proper HTTP Status Code

RESTful services use HTTP status codes to specify the outcomes of HTTP method execution. HTTP protocol specifies the outcome of a request execution using an integer and a message. The number is known as the status codeand the message as the reason phrase. The reason phrase is a human readable message used to clarify the outcome of the response. HTTP protocol categorizes status codes in ranges.

### Status Code Mappings

When responding to API requests, the following status code ranges MUST be used.

**200 OK** - Generic successful execution.

**201 Created** - Used as a response to POST method execution to indicate successful creation of a resource.

**202 Accepted** - Used for asynchronous method execution to specify the server has accepted the request and will execute it at a later time. For more details, please refer Asynchronous Operations.

**204 No Content** - The server has successfully executed the method, but there is no entity body to return.

**400 Bad Request** - The request could not be understood by the server. Use this status code to specify:

• The data as part of the payload cannot be converted to the underlying data type.

• The data is not in the expected data format.

• Required field is not available.

• Simple data validation type of error.

**401 Unauthorized** - The request requires authentication and none was provided. Note the difference between this and 403 Forbidden.

**403 Forbidden** - The client is not authorized to access the resource, although it may have valid credentials. API could use this code in case business level authorization fails. For example, accound holder does not have enough funds.

**404 Not Found** - The server has not found anything matching the request URI. This either means that the URI is incorrect or the resource is not available. For example, it may be that no data exists in the database at that key.

**405 Method Not Allowed** - Theserver has not implemented the requested HTTP method. This is typically default behavior for API frameworks.

**406 Not Acceptable** - The server MUST return this status code when it cannot return the payload of the response using the media type requested by the client. For example, if the client sends an Accept: application/xml header, and the API can only generate application/json, the server MUST return 406.

**415 Unsupported Media Type** - The server MUST return this status code when the media type of the request's payload cannot be processed. For example, if the client sends a Content-Type: application/xml header, but the API can only accept application/json, the server MUST return 415.

**422 Unprocessable Entity** - The requested action cannot be performed and may require interaction with APIs or processes outside of the current request. This is distinct from a 500 response in that there are no systemic problems limiting the API from performing the request.

**429 Too Many Requests** - The server must return this status code if the rate limit for the user, the application, or the token has exceeded a predefined value.

**500 Internal Server Error** - This is either a system or application error, and generally indicates that although the client appeared to provide a correct request, something unexpected has gone wrong on the server. A 500 response indicates a server-side software defect or site outage. 500 SHOULD NOT be utilized for client validation or logic error handling.

**503 Service Unavailable** - The server is unable to handle the request for a service due to temporary maintenance.

### HTTP Method to Status Code Mappings

For each HTTP method, API developers SHOULD use only status codes marked as "X" in this table.

If an API needs to return any of the status codes marked with an **X**, then the use case SHOULD be reviewed as part of API design review process. Most of such status codes are used to support very rare use cases.

| Status Code | 200 Success | 201 Created | 202 Accepted | 204 No Content | 400 Bad Request | 404 Not Found | 422 Unprocessable Entity | 500 Internal Server Error |
| ----------- | ----------- | ----------- | ------------ | -------------- | --------------- | ------------- | ------------------------ | ------------------------- |
| GET         | X           |             |              |                | X               | X             | **X**                    | X                         |
| POST        | X           | X           | **X**        |                | X               | **X**         | **X**                    | X                         |
| PUT         | X           |             | **X**        | X              | X               | X             | **X**                    | X                         |
| PATCH       | X           |             |              | X              | X               | X             | **X**                    | X                         |
| DELETE      | X           |             |              | X              | X               | X             | **X**                    | X                         |
