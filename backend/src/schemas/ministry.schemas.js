const { z } = require("zod");

// ── Ministry Resource ─────────────────────────────────────────────────────────
const resourceSchema = z.object({
  title       : z.string().min(2),
  description : z.string().optional().nullable(),
  type        : z.enum(["PDF", "PPTX", "AUDIO", "VIDEO", "WORD"]),
  fileUrl     : z.string().min(1),
  storagePath : z.string().optional().nullable(),
  originalName: z.string().optional().nullable(),
  mimeType    : z.string().optional().nullable(),
  extension   : z.string().optional().nullable(),
  sizeBytes   : z.union([z.number(), z.bigint()]).optional().nullable(),
});

module.exports = { resourceSchema };
