const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Pull this into a const because mebbe we can refactor to set from ENV or config later
const url = 'mongodb://localhost:27017/production';
let db;

class DB {
	// Is this default param semantic weird?
	connect(success=Function, err=Function) {
		MongoClient.connect(url, function(clientErr, database) {
	  	
		  // Set it and forget it
		  db = database;

		  if (clientErr) {
		  	return err(clientErr);
		  } else {
		  	return success();
		  }
		});
	}

	getDb() {
		if (!db) {
			console.log('Database has not been initialized yet');
		}

		return db;
	}

	findOne(collectionName, query) {
		return this.getDb().collection(collectionName).findOne(query)
      .then((result) => {
        if (result === null) {
          return {};
        } else {
					this.data = this._serializeData(data);
          return this;
        }
      });
	}
}

module.exports = new DB();