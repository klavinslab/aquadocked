# The Aquarium API

Third party applications can communicate with Aquarium through the Aquarium API through http-post and json. The API enables your application to query the Aquarium databased to retrieve information of inventory and jobs, as well as to insert new inventory (such as samples), start jobs, submit tasks, and more.

This document starts assuming you know how to send an HTTP POST request. If you need a refresher, see Appendix 2.

## Authentication

All requests sent to Aquarium need to include a valid login name and a key. Keys can be obtained via the Aquarium UI on the user's profile page. The simplest request to the API has the following form.

	{ 
      "login": "eric123",
	  "key": "FMCdd9bZ5swg85pSu5cPC2PbP3G8pvHNf8rgEOARNg8"
	}
	
## Request Format

All requests, beyond simply authenticating, have the following form.

	{ 
		"login": string,
		"key": string,
		"run": {
			"method": string
			"args": json
		}
	}

Essentially, this form requests that the API run the method indicated in the "method" field on the arguments indicated by the "args" field. The methods available are "find", "create", and "submit", which are described below.

**Note**: Future versions of the API will allow an array of methods to be run.

## Responses

The Aquarium API will respond to requests with a JSON object the following fields.

**<tt>result</tt>**: The value of this field is either "ok" or "error".

**<tt>errors</tt>**: The value of this field is an array of error messages that is present only if there are errors.

**<tt>warnings</tt>**: The value of this field is an array of warnings, only present if something odd is detected.

**<tt>rows</tt>**: An array of Aquarium objects resulting from the method run (see below).

## Find

If "method" is "find", then the following arguments can be given.

**<tt>model</tt>**: Required. One of "user", "job", "task", "item", "sample", "sample_type" or "object_type". 

**<tt>where</tt>**: Optional. Specifies which rows to include. For example,


	"run" : {
		"method": "find",
		"args": { 
			"model": "item",
			"where": { "id": 123 }
		}
	}
	
requests all items whose id is 123, which should result in no more than one item. If no "where" field is specified, the request returns all models (unless a limit is specified, as below).

To retrieve multiple rows which satisfy a given set of conditions, use an array in your "where" hash.

	"run" : {
			"method": "find",
			"args": { 
				"model": "item",
				"where": { "id": [123,124] }
			}
		}
This will return two items: one with the ID 123 and the other with the ID 124, provided they exist.		

**<tt>includes</tt>**: Which associations to include. For example,

    run: {
    	"method": "find",
    	"args": {
    		"model": "item",
        	"where": { "sample": { "name" "CFP_r" } },
       		"includes": "sample"
        }
    }
	
retrieves all items whose associated sample is named "CFP_r". Without the "includes" field, the request would fail because the sample associated with the item would not be included in the database query.

**<tt>limit</tt>**: How many rows to return. For example,

	run: {
    	"method": "find",
	    "args": {
    		"model": "item",
    		"limit": 32
        }
    }
    
Returns the first 32 items in the database.

## Create

### Creating Samples

To create a new sample, use the method "create" as in the following example:

	run: {
        "method": "create",
        "args": {
            "model": "sample",
            "type": "Primer",
            "name": "MyPrimer",
            "project": "Test",
            "description": "This is a test of the create api method",
            "fields": {
                "Overhang Sequence": "atccaggactaggacta",
                "Anneal Sequence": "atctcggctatatcgac",
                "T Anneal": 67.8
            }
        }
    }

Setting the "model" field to "sample "tells the "create" method to create a new sample. Future versions of the create method will allow you to create object_types and sample_types as well. The "type" field must correspond to the name of an existing sample type. The "name" field must be unique. The description is any string. The fields are those fields that are declared in the sample type definition (e.g. via the sample type page). These fields can be strings, numbers, urls, or either the sample id or sample name of another sample.

Note that when you create a sample, the "user" field of the sample will correspond to the user that was authenticaed in the request (see above).

There is a limit to the number of samples you can submit in a 24 hour period (configurable by your Aquarium administrator). If you attempt to submit more samples, you will get an error.

### Creating Tasks

Tasks can be created similarly, as in the following example.

	run: {
        "method": "create",
        "args": {
            "model": "task",
            "name": "MyTask",
            "status": "waiting",
            "task_prototype_id": 5,       
            "specification": {
                "plasmid": 2,
                "fragments": [ 5636, 5637, 5638 ]
            }
        }
    }

Here, the "task_prototype_id" corresponds to a Gibson Assembly on our local installation. This number could have been found by running a "find" for the task_prototype with that name and getting the id from the first row returned. The "specification" field must match the json specification in the corresponding task prototype.

There is a limit to the number of tasls you can submit in a 24 hour period (configurable by your Aquarium administrator). If you attempt to submit more tasks, you will get an error.

### Creating Jobs

## Drop

### Dropping Samples

Samples can only be deleted by the user who owns them and only if there are no corresponding items. It is expected that deleting samples would be used mainly if and when samples were created erroneously via some algrothmic connection to Aquarium.

Samples can be dropped by name and/or by id. For example:

	run: {
        "method": "drop",
        "args": {
            "model": "sample",
			"names": [ "sample_one, "sample_two" ],
			"ids": [ 123, 234, 345 ]
        }
    }
 
### Dropping Tasks

TODO: Can only drop a task if it has no associated jobs and it is owned by the current user.

### Deleting Items

TODO: Items can be deleted only by the user who owns the associated sample. It marks them as deleted, but does not truely delete them (i.e. the id will still be in use).

## Modify

### Changing a Task's Status

### Canceling a Job

# Appendix 1: Aquarium Datatypes

## object_type

## sample_type

## sample

## item

	"id": integer
	"location": string
	"quantity": integer
    "sample_id": integer
	"object_type_id": integer
	"created_at": date string
	"updated_at": date string
	"data": json
	"sample": associated sample (optional)
	"object_type": associated object_type (option)

## job

## task_prototype

## task

## user

# Appendix 2: Connecting to the API via various languages
## cURL
    curl http://54.68.9.194:82/api -H "Content-Type: application/json" --data "{'login':'user-name','key':'key-here'}" -X POST -w "\n"

## Ruby

## Python 2.7

```python
import urllib2
import json

url = 'http://54.68.9.194:82/api' #port 81 for production
data = {'login':'my-user-same',
        'key':'my-secret-key'}

req = urllib2.Request(url,json.dumps(data))
req.add_header("Content-Type","application/json")

resp = urllib2.urlopen(req)
#read server's response into a python dict
rdata = json.loads(resp.read()) 

print rdata 
```

## Javascript

## MATLAB

## Mathematica (v9 + )

```mathematica
URLFetch["54.68.9.194:82/api",
  "Method" -> "POST",
  "Body" -> "{
  \"login\":\"my-user-name\",
  \"key\":\"my-secret-key\"
  }", "Headers" -> {"Content-Type" -> "application/json"}
]
```
