const spacy = require('spacy');

const nlp = spacy.default.load('en_core_web_sm');

(async function() {
    const doc = await nlp('This is a text about Facebook.');
    for (let ent of doc.ents) {
        console.log(ent.text, ent.label);
    }
    for (let token of doc) {
        console.log(token.text, token.pos, token.head.text);
    }
})();