import { z } from "zod";

export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const addressSchema = z.object({
  street: z.string().min(3, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, "Informe o bairro"),
  state: z
    .string()
    .min(2, "Informe a UF")
    .max(2, "Use apenas a sigla da UF"),
  zipCode: z
    .string()
    .min(8, "Informe o CEP")
    .refine(
      (value) => onlyDigits(value).length === 8,
      "Informe o CEP com 8 dígitos",
    ),
});

export const profileSchema = z.object({
  fullNameEnterprise: z.string().min(3, "Informe o nome da empresa"),
  birthData: z.string().min(1, "Informe a data de abertura"),
  cnpj: z
    .string()
    .min(14, "Informe o CNPJ com 14 dígitos")
    .refine(
      (value) => onlyDigits(value).length === 14,
      "Informe o CNPJ com 14 dígitos",
    ),
  address: addressSchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type SubmitStatus = {
  type: "success" | "error";
  message: string;
};

export type CepLookupState = {
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
};
