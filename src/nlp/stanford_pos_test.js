var Tagger = require("node-stanford-postagger/postagger").Tagger;
var tagger = new Tagger({
  port: "9000",
  host: "localhost"
});

tagger.tag("Hello, world!", function(err, resp) {
  if (err) return console.error(err);
  console.log(resp);
});