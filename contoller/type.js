const zod = require("zod");

const credentials = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

const movie = zod.object({
  title: zod.string(),
  image: zod.string(),
  runtime: zod.string().optional(),
  ratings: zod.string().optional(),
  language: zod.string().optional(),
  country: zod.string().optional(),
  list_id: zod.string().min(1),
});

module.exports = {
  credentials,
  movie,
};
