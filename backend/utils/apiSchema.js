import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(4),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
export const createCampaignSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  campaignType : z.string().min(1, { message: "Category is required" }),
  target: z.number().positive({ message: "target must be a positive number" }),
  deadline: z.number().refine((val) => val > Date.now(), {
    message: "Deadline must be a future timestamp"
  }),
  image: z.string().url({ message: "Image must be a valid URL" }),
});

export const donateCampaignSchema = z.object({
   amount : z.number().positive({ message: "Amount must be a positive number" }),
});

export const updateCampaignSchema = createCampaignSchema.partial();
