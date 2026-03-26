const { z } = require("zod");

// ── Categories ───────────────────────────────────────────────────────────────
const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  iconKey: z.string().optional().nullable(),
  iconColor: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// ── Items ────────────────────────────────────────────────────────────────────
const isValidUrl = (val) => {
  try {
    const u = new URL(val);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
};

const itemSchema = z.object({
  categoryId: z.string().min(1),
  type: z.enum(["YOUTUBE", "DRIVE", "ONEDRIVE", "OTHER"]).optional(),
  title: z.string().min(2),
  url: z.string().refine(isValidUrl, { message: "URL inválida" }),
  description: z.string().optional().nullable(),
  iconKey: z.string().optional().nullable(),
  iconColor: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// ── Hero Slides ───────────────────────────────────────────────────────────────
const heroSlideSchema = z.object({
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().min(1, "La imagen es obligatoria"),
  linkUrl: z.string().optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

module.exports = { categorySchema, itemSchema, heroSlideSchema };
