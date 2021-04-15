const mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifieldTopology: true
}; 



mongoose.connect('mongodb+srv://admin:KOAEKXWhZ6GCe0Og@cluster0.cogwr.mongodb.net/Ticketac?retryWrites=true&w=majority'),
    options, 
    function(err) {
        if (err) {
            console.log('erreur, failed to connect to the database ${err}'); 
        } else {
            console.info(' *** DB Connection Success ***');
        }
    }

module.exports = mongoose; 