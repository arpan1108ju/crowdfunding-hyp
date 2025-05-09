import { Role } from "@prisma/client";
import { z } from "zod";

export const RoleSchema = z.nativeEnum(Role);

// 2. changeRoleSchema: only allows "ADMIN" and "USER"
export const changeRoleSchema = z.object({
  role: z.enum([Role.ADMIN, Role.USER])
});

export  const verifiedSchema = z.enum([
  "true",
  "false"
]).optional();


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

export const currencySchema = z.enum([
  "USD",
  "INR"
])


export const setExchangeRateSchema = z.object({
  currency : currencySchema,
  rate : z.number().positive({message : "rate must be positive"})
})

export const setTokenMetadataSchema = z.object({
    name : z.string().min(3),
    symbol : z.string().min(3)
})

export const mintTokenSchema = z.object({
   currency : currencySchema,
   amountPaid : z.number().positive({message : "amount paid must be positive"})
})
