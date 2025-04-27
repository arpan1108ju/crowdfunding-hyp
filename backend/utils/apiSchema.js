import { Role } from "@prisma/client";
import { z } from "zod";

export const RoleSchema = z.nativeEnum(Role);

// 2. changeRoleSchema: only allows "ADMIN" and "USER"
export const changeRoleSchema = z.object({
  role: z.enum([Role.ADMIN,Role.SUPERADMIN,Role.USER])
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
  target: z.number().int().positive({ message: "target must be a positive integer" }),
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
  "USD", // US Dollar
  "INR", // Indian Rupee
  "EUR", // Euro
  "GBP", // British Pound
  "AUD", // Australian Dollar
  "CAD", // Canadian Dollar
  "JPY", // Japanese Yen
  "CNY", // Chinese Yuan
  "SGD", // Singapore Dollar
  "NZD", // New Zealand Dollar
  "CHF", // Swiss Franc
  "HKD", // Hong Kong Dollar
  "SEK", // Swedish Krona
  "NOK", // Norwegian Krone
  "DKK", // Danish Krone
  "ZAR", // South African Rand
  "BRL", // Brazilian Real
  "MXN", // Mexican Peso
]);


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
   amountPaid : z.number().positive({message : "amount paid must be positive"}),
   paymentId : z.string()
})

export const paymentSchema = z.object({
  currency : currencySchema,
  amountPaid : z.number().positive({message : "amount paid must be positive"})
})


/*************************************** */

const PrivateKeySchema = z.string().refine(
  (val) => val.startsWith("-----BEGIN PRIVATE KEY-----") && 
          val.includes("-----END PRIVATE KEY-----"),
  "Invalid private key format"
);

const CertificateSchema = z.string().refine(
  (val) => val.startsWith("-----BEGIN CERTIFICATE-----") && 
          val.includes("-----END CERTIFICATE-----"),
  "Invalid certificate format"
);

const CredentialsSchema = z.object({
  privateKey: PrivateKeySchema,
  certificate: CertificateSchema,
}).strict(); // No extra fields allowed

export const x509Schema = z.object({
  type: z.literal("X.509"), // Must be exactly "X.509"
  mspId: z.string().min(1).regex(/^Org\d+MSP$/, "Invalid MSP ID format"),
  credentials: CredentialsSchema,
}).strict();

