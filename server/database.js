const { MongoClient, ObjectID } = require("mongodb");

const mongoConnectionString = process.env.LOCAL
? "mongodb://localhost/gubbins"
: `mongodb://${
  process.env.DBUSER
}:${
  process.env.DBPASS
}@${
  process.env.DBURL
}`;

console.log(`Connecting to mongo: ${mongoConnectionString}`);

const client = MongoClient.connect(mongoConnectionString, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

exports.getCollection = async (name) => {
  return (await client).db("gubbins").collection(name);
}

exports.addGub = async (content, id, {
  numberOfUses = 1,
  hoursToLive = 24,
  from = null
} = {
  numberOfUses: 1,
  hoursToLive: 24,
  from: null
}) => {
  const gubs = await exports.getCollection("gubs");
  let deathDate = new Date().getTime() + (hoursToLive) * 1000 * 60 * 60;
  if (isNaN(deathDate)) {
    throw new Error(`Invalid death date (check hoursToLive: ${hoursToLive}, deathDate: ${deathDate}`);
  }
  await gubs.insertOne({
    id,
    content,
    numberOfUses,
    from,
    deathDate
  });
  return id;
};

exports.getGub = async (id) => {
  const gubs = await exports.getCollection("gubs");
  const { value: gub, ok } = await gubs.findOneAndUpdate({ id }, {
    $inc: {
      numberOfUses: -1
    }
  }, { returnOriginal: false });
  if(!ok || !gub) {
    return false;
  }
  if(gub.deathDate < new Date().getTime() || gub.numberOfUses < 0) {
    gubs.findOneAndDelete({ id });
    return false;
  }
  if(gub.numberOfUses === 0) {
    gubs.findOneAndDelete({ id });
  }
  return {
    content: gub.content,
    from: gub.from
  };
};

exports.cleanGubs = async () => {
  const gubs = await exports.getCollection("gubs");
  await gubs.remove({
    $or: [
      { numberOfUses: { $lte: 0 } },
      { deathDate: { $lte: new Date().getTime() } },
      { deathDate: { $eq: "NaN" } }
    ]
  });
}
