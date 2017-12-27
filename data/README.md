### Where to put it

In typical Ross fashion, I got juuust good enough at SQL syntax to try something new. For a moment there I even had the radical notion: why not store the collection of reads in a flat file? There's something tantalizing about how simple all that would be. 

id    title                  startDate ...
1     Parable of the Sower   2017-12-27T19:24:06.975Z
2     If Hemingway Wrote...  2017-12-27T19:24:06.975Z

Then I could write my own query layer and Node's file system module would be adequate reading in/out. But the reality is that this file was gonna get definitely get big over time if I'm diligent about tracking my reads. Besides, I couldn't rightly claim to be a JavaScript developer without mucking around with mongo at some point. I mean, it's so JavaScripty. Like you use JS-like property lookup notation on the db object in the mongo shell, eg `db['reads'].findeOne()`. The query data structure and returned documents are some flavor of JSON (BSON) or actual JSON.

The flexibility of schema is a nicety, too. Recently I was talking to a PM friend who said he starts some projects off in mongo while figuring out the data architecture. That sort of blew my mind. Nosql is certainly a bit more fault tolerant when you're first discovering relationships of your domain objects. Which also makes it good for a meandering personal side project. That said, the spartan elegance of SQL syntax strings is missed.
