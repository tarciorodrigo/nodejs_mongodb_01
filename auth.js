const { connect } = require('./db');

async function findUser(nome) {
    const connection = await connect();

    return connection
            .collection("users")
            .findOne({ nome });
}

module.exports = {
    findUser
}