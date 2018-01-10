**1/9/18**: Object.freeeeeeeze. Never used that before. It's nice assurance to lock this down and force me to be properly mixin objects when creating (no pants) models.

### Where to put it

In typical Ross fashion, I got juuust good enough at SQL syntax to try something new. For a moment there I even had the radical notion: why not store the collection of reads in a flat file? There's something tantalizing about how simple all that would be. 

```
id    title                   author              startDate                 
1     Parable of the Sower    Butler, Octavia     2017-12-27T19:24:06.975Z
2     If Hemingway Wrote...   Croll, Angus        2017-12-27T19:24:06.975Z
```

Then I could write my own query layer and Node's file system module would be adequate reading in/out. But the reality is that this file was definitely gonna grow over time if I'm diligent about tracking my reads. Besides, I couldn't rightly claim to be a JavaScript developer without mucking around with mongo at some point. I mean, it's so JavaScripty. Like you use JS-like property lookup notation on the db object in the mongo shell, eg `db['reads'].findeOne()`. The query data structure and returned documents are some flavor of JSON (BSON) or actual JSON.

The flexibility of schema is a nicety, too. Recently I was talking to a PM friend who said he starts some projects off in mongo while figuring out the data architecture. That sort of blew my mind. Nosql is certainly a bit more fault tolerant when you're first discovering relationships of your domain objects. Which also makes it good for a meandering personal side project. That said, the spartan elegance of SQL syntax strings is missed.

### Active doc

![21rb6r](https://user-images.githubusercontent.com/5185/34392973-2dd5bef6-eb04-11e7-8f6f-ff29d8a33b21.jpg)

It's no surprise I'm recreating familiar Active Record patterns in this code. I've worked mostly with Rails and Ember frameworks. But it makes sense for the reasons it makes sense for a simple CRUD app like this:

> _Active Record_ is a good choice for domain logic that isn't too complex, such as creates, reads, updates, and deletes. Derivations and validations based on a single record work well in this structure. (p161, PEAA)

Therefore I've got a base object called `ActiveDoc` which contains persistence, query, and validation logic. Then any `Model` (ie record/document), lol which at this point I only have one, is mixed (_Object.assign_) with the base object and can easily extend or customize this behavior. Coupling the Models to the db design, considered a weakness of AR, is fine for now. Literally we have one domain object and the schema is consistent between db and application layers.

Maybe I'll feel more experimental in the future and break up the `ActiveDoc` AR MONOLITH and consider smaller Separated Interfaces to contain smaller responsibilities: validation and persistence, etc... while keep schema (attributes) and computed props on `Model`.

### Meh, early, bad ideas

- At first I actually built a `Store` object like Ember's Data Mapper/Identity Map concept -- in my case it was only responsible for retrieval (Data Mapper), since I don't need any client caching (yet?). So [removed](https://github.com/rosschapman/if-ross-wrote-javascript/commit/e75aae686917e238c98aca4edae098d10f246906) that. 

- Had a weird moment where I almost went down the route of creating an object instance of a parent on when calling `create()` on a child (ie `Note` < `Read`). Once I saw myself having async code in a property set I knew this was gonna get weird. Just set the ID string jeez.

``` 
// NOPE
set parentId(id) {
  this.findOne(ObjectId(id)).
}
```
