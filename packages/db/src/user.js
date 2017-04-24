const Datastore = require('nedb');
const Utils = require('./utils');
const db = new Datastore({ filename: 'users.db', autoload: true });

db.persistence.compactDatafile();

function getAll() {
    return Utils.asPromised((cb) => db.find({}, cb));
}
function get({ id }) {
    return Utils.asPromised((cb) => db.findOne({ _id: id }, cb));
}

function add(params, body) {
    return Utils.asPromised((cb) => db.insert(body, cb));
}

function update({ id }, body) {
    return Utils.asPromised((cb) => db.update({ _id: id }, body, (err) => {
        if (err) {
            cb(err, null);
        } else {
            db.findOne({ _id: id }, cb);
        }
    }));
}

function remove({ id }) {
    return Utils.asPromised((cb) => db.remove({ _id: id }, (err) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, {});
        }
    }));
}

module.exports = {
    'get /': getAll,
    'get /:id': get,
    'post /': add,
    'put /:id': update,
    'delete /:id': remove,
};