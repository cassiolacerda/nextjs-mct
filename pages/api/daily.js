import { ObjectID } from "mongodb";
import nextConnect from "next-connect";
import middleware from "../../util/database";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  let data = req.body;
  data = JSON.parse(data);
  data.date = new Date(data.date);
  await req.db
    .collection("daily")
    .updateOne({ date: data.date }, { $set: data }, { upsert: true });

  res.json({ message: "ok" });
});

handler.get(async (req, res) => {
  const { date } = req.query;

  let doc = {};

  if (date) {
    doc = await req.db.collection("daily").findOne({ date: new Date(date) });
  } else {
    doc = await req.db.collection("daily").findOne();
  }
  if (!doc) {
    doc = {
      _id: new ObjectID(),
      date: new Date(),
      calories: { label: "Calories", total: 0, target: 0, variant: 0 },
      carbs: { label: "Carbs", total: 0, target: 0, variant: 0 },
      fat: { label: "Fat", total: 0, target: 0, variant: 0 },
      protein: { label: "Protein", total: 0, target: 0, variant: 0 },
    };
  }

  res.json(doc);
});

export default handler;
