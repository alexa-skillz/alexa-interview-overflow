# Get the Project Running

First, install MongoDB. The instructions are [here](https://docs.mongodb.com/manual/installation/).

Now, type the following in your command line:

1. `git clone https://github.com/alexa-skillz/alexa-interview-overflow.git`
2. `cd alexa-interview-overflow.git`
3. `npm install`
4. `brew install httpie`
5. Go to [MLab](https://mlab.com/) and set up an account following [these instructions](http://www.nightscout.info/wiki/welcome/configuring-the-data-backend)
6. Open another terminal and type: `mongod`
7. Open yet another terminal and type: `npm start`
8. Add a `.env` file to the root directory of this lab and add something similar to following (you will get your MLab URI, database username, and database password from your MLab account):

```
PORT='3000'
MONGO_URI='mongodb://<your_db_username>:<your_db_password>@ds157288.mlab.com:57288/alexa'
APP_SECRET='coolsecret'
```

These are your environment variables. Be sure to add your `.env` file to your `.gitignore` since you want to keep this information secret. Shhh...

You will now see the phrase "server is up at port: 3000" if you have not already specified a port number.
