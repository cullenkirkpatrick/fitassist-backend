# fitassist-backend
Node Service for FitAssist Application.

1. Log onto AWS and start MongoDB instance.
2. Log into Linux box by going to the folder containing pem file and run "ssh -i pemkey.pem ec2-user@ec2-ip-sep-by-dash.compute-1.amazonaws.com
3. Run "mongod --bind_ip 0.0.0.0 -v" to start mongo.
4. Alter the IP in the simpleServer.js file to match the instance public IP.
5. Navigate to folder and run "node simpleServer.js"
