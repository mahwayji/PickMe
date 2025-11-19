import {z} from "zod"

const ColorHexZ = z.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Invalid hex color");
const FontFamilyZ = z.enum([
  "Arial",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
]);
const FontWeightZ = z.enum(["light", "regular", "bold"]);
const FontSizeZ = z.number().min(8).max(80);


const TextStyleZ = z.object({

    font: FontFamilyZ.optional(),
    weight: FontWeightZ.optional(),
    size: FontSizeZ.optional(),
    color: ColorHexZ.optional(),
    align: z.enum(["left", "center", "right"]).optional(),
    italic: z.boolean().optional(),
    underline: z.boolean().optional(),
})

export const TextBlockZ = z.object({

    type: z.literal("text"),
    text: z.string().min(1),
    style: TextStyleZ.optional(),
});

export const ImageBlockZ = z.object({

    type: z.literal("image"),
    url: z.url(),
    caption: z.string().max(200).optional(),
    alt: z.string().max(120).optional(),
    aspectRatio: z.number().positive().optional(),
});

export const VideoBlockZ = z.object({

    type: z.literal("video"),
    url: z.url(),
    provider: z.enum(["upload", "youtube"]).optional(),
    caption: z.string().max(200).optional(),
    controls: z.boolean().optional(),
    muted: z.boolean().optional(),
    startAt: z.number().int().min(0).optional(),
    endAt: z.number().int().min(0).optional(),
    aspectRatio: z.number().positive().optional(),
});

export const BlockZ = z.discriminatedUnion("type", [
  TextBlockZ,
  ImageBlockZ,
  VideoBlockZ,
]);

export type ContentBlock = z.infer<typeof BlockZ>;