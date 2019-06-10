var bodybuilder = require('bodybuilder')
var body = bodybuilder().query('match', 'message', 'this is a test')
body.build() // Build 2.x or greater DSL (default)
// Build 1.x DSL

console.log(body);