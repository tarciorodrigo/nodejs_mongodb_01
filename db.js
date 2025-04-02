const { MongoClient, ObjectId } = require("mongodb");

const PAGE_SIZE = 10;

async function connect() {
  
    if (global.connection) 
        return global.connection;

    //const client = new MongoClient("mongodb://127.0.0.1:27017/");
    const client = new MongoClient(process.env.MONGODB_CONNECTION);

    try {
        await client.connect();
        //global.connection = client.db("aula03");
        global.connection = client.db(process.env.MONGODB_DATABASE);
        console.log("Connected!!!");
    }
    catch (err) {
        console.error(err);
        global.collection = null;
    }

    return global.connection;
}

//connect();

// function findCustomer(callback) {
//     return global.connection
//                  .collection("customers")
//                  .find()
//                  .toArray((error, docs) => {
//                     callback(error, docs)
//                  });
// }

async function insertCustomer(customer) {
    const connection = await connect();
    return connection
            .collection("customers")
            .insertOne(customer);
}

async function countCustomers() {
    const connection = await connect();
    return connection
           .collection("customers")
           .countDocuments();
}

async function findCustomers() {
    const connection = await connect();
    return connection
           .collection("customers")
           .find()
           .toArray();
}

async function findCustomersPerPage(page = 1) {
    const totalSkip = (page - 1) * PAGE_SIZE;
    const connection = await connect();
    return connection
           .collection("customers")
           .find()
           .skip(totalSkip)
           .limit(PAGE_SIZE)
           .toArray();
}

async function findCustomer(id) {    
    const objectId = ObjectId.createFromHexString(id);

    const connection = await connect();
    return connection
            .collection("customers")
            .findOne({ _id: objectId });
}

async function updateCustomer(id, customer) {
    const objectId = ObjectId.createFromHexString(id);

    const connection = await connect();
    return connection
            .collection("customers")
            .updateOne({ _id: objectId }, { $set: customer } );
}

async function deleteCustomer(id) {
    const objectId = ObjectId.createFromHexString(id);

    const connection = await connect();
    return connection
            .collection("customers")
            .deleteOne({ _id: objectId });
}

module.exports = {
    insertCustomer,
    countCustomers,
    findCustomers,
    findCustomer,
    findCustomersPerPage,
    updateCustomer,
    deleteCustomer,
    connect,
    PAGE_SIZE
}