var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var rssSchema = new Schema({
    titulo: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'El precio únitario es necesario'] },
    url: { type: String, required: false },
});


module.exports = mongoose.model('Rss', rssSchema);
