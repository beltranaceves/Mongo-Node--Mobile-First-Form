# IPM1920-P3
Simple workout creation form.


[Live Demo](https://ipm1920-p3.herokuapp.com/)

This is a first aproximation to vanilla web development. Concepts included:

- Mobile-first design.
- W3C compliant HTML and CSS.
- ARIA and a11y accesibility practices.
- Dynamic content.
- Node.js based backend without library routing.
	

## Roadmap
- Load available workouts from Db.
- Alert feedback styling integration.
- Localization.
- Rework into PWA.

## Requirements

- Node 12.14.0+. 

## Database creation

```
Doesn't use local database anymore. Connecs to MongoDb Atlas.

If you want to use your own MongoDb instance change the connection string urldb to:
					"mongodb://localhost:27017/<databaseName>".

Make sure you have a collection named "workouts".
```

## Run
To run localy change url const in /src/javascripts/client.js to "http:localhost:8000".
```
cd /directory/src
node server.js
```
