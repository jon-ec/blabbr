# Blabbr

A simple API to store and retrieve comments from a Firebase database.
 
## Getting started

- Clone this repo and 'npm install' dependencies.
- Rename the config.default.json to config.json
- Enter your API details from Firebase into the config.json file
- Type 'npm start'

The project will fire up a server hosted on port 3000.

## Adding a comment

Create a 'POST' request to http://localhost:3000/[COMPONENTID] with the following JSON as you body e.g. :

```
{
	"userName": "George",
	"userEmail": "george.smith@wipro.com",
	"comment": "Looks good - approved!"
}
```

If the POST was successfull you'll recieve the following JSON back:
```
{
  "success": 1  
}
```

## Retrieving a comment

Create a 'GET' request to http://localhost:3000/[COMPONENTID]

Here's a sample of the data that would be returned

```
{
  "success": 1,
  "comments": {
    "undefined": {
      "-Kag04f2kgW1a0NLErbJ": {
        "comment": "Please add a 2px black border",
        "componentId": "/dropdown",
        "timestamp": 1484649683645,
        "userEmail": "tim.sail@wipro.com",
        "userName": "Tim"
      },
      "-Kag0Kt2cjeA-7YyHrrR": {
        "comment": "Looks good - approved!",
        "componentId": "/dropdown",
        "timestamp": 1484649752200,
        "userEmail": "george.smith@wipro.com",
        "userName": "George"
      }
    }
  }
}
```

## TODO

- Delete a comment
- Authentication