// Find posts where name equals argument

// HTTP API
// http://localhost:3000/functions/loadPostsByName?name=joe

// GraphQL
// {
//   loadPostsByName(name: "joe") {
//     id
//     rev
//     name
//   }
// }

module.exports = (ctx, input) => {
  //Logging to output
  ctx.log(input.name);

  //Using PouchDB within your functions
  ctx.pouchdb('gettingstarted')
    .find({ selector: {name: input.name} })
    .then(data => ctx.success(data.docs.map(toPost)));
};

function toPost(doc){
  doc.id = doc._id;
  doc.rev = doc._rev;
  return doc;
}
