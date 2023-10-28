# 4389 E-Commerce Website Project
### Front End
To run the front end code serve the files (using live-server or something similar) at `http://localhost:8080`. It must be `localhost` and not `127.x.x.x` or `192.168.x.x` and it must be port `8080` for the authentication service to work because it is configured to only accept traffic from the AWS hosted URL and `localhost:8080`. 
To run it, in your terminal go to the directory that contains the `index.html` file and run:
```
live-server --host=localhost --port=8080
```

### API Integration
The `prod-orders-rest-endpoint.mjs` and `prod-products-rest-endpoint.mjs` files have been provided but they are meant to be run as a AWS Lambda function in the privileged account so you will not be able to run them on your own machine.