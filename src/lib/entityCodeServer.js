import CodeSequence from "./models/CodeSequence.js";
import { formatEntityCode } from "./entityCode.js";

const MODELS = {
  product: { modelName: "Product", field: "productSKU" },
  brand: { modelName: "Brand", field: "brandCode" },
  category: { modelName: "Category", field: "categoryCode" },
  subcategory: { modelName: "Subcategory", field: "subcategoryCode" },
};

async function highestExistingSequence(Model, field, entity) {
  const prefix = { product: "PRD", brand: "BRD", category: "CAT", subcategory: "SUB" }[entity];
  const records = await Model.find({ [field]: { $regex: `^${prefix}-.+-\\d+$` } }).select(field).lean();
  return records.reduce((highest, record) => {
    const suffix = Number(String(record[field] || "").match(/-(\d+)$/)?.[1] || 0);
    return Number.isSafeInteger(suffix) ? Math.max(highest, suffix) : highest;
  }, 0);
}

export async function allocateEntityCode(entity, name, Model) {
  const config = MODELS[entity];
  if (!config || !Model) throw new Error("A supported entity and model are required to allocate a code.");
  const segments = formatEntityCode(entity, name, 1);
  if (!segments) {
    const error = new Error("Enter a name before generating a code.");
    error.statusCode = 400;
    throw error;
  }

  const seed = await highestExistingSequence(Model, config.field, entity);
  // The update pipeline is atomic for this _id, so concurrent application
  // instances receive distinct increasing values even during first use.
  const incrementPipeline = [{
    $set: {
      value: {
        $add: [
          { $max: [{ $ifNull: ["$value", 0] }, seed] },
          1,
        ],
      },
    },
  }];
  let sequence;
  try {
    sequence = await CodeSequence.findOneAndUpdate(
      { _id: config.modelName },
      incrementPipeline,
      { upsert: true, new: true, setDefaultsOnInsert: false },
    );
  } catch (error) {
    // Simultaneous first use can race on the counter's unique _id. The loser
    // increments the now-existing counter and still receives a unique value.
    if (error?.code !== 11000) throw error;
    sequence = await CodeSequence.findOneAndUpdate(
      { _id: config.modelName },
      incrementPipeline,
      { new: true, setDefaultsOnInsert: false },
    );
  }
  if (!sequence) throw new Error("Unable to allocate a unique code sequence.");
  return formatEntityCode(entity, name, sequence.value);
}

export async function createWithGeneratedCode({ entity, Model, name, data, attempts = 8 }) {
  const field = MODELS[entity]?.field;
  if (!field) throw new Error("Unsupported code entity.");
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const code = await allocateEntityCode(entity, name, Model);
    try {
      return await Model.create({ ...data, [field]: code });
    } catch (error) {
      const duplicateField = error?.keyPattern?.[field] || error?.keyValue?.[field] !== undefined;
      if (error?.code !== 11000 || !duplicateField) throw error;
    }
  }
  const error = new Error("Unable to allocate a unique code. Please try again.");
  error.statusCode = 503;
  throw error;
}
