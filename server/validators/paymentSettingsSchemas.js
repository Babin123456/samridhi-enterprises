import { z } from "zod";

const booleanCoerce = z.preprocess((val) => {
  if (val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return undefined;
}, z.boolean().optional());

export const adminUpdatePaymentSettingsSchema = z.object({
  body: z.object({
    upiId: z.string().trim().optional(),
    notifyAdminsOnNewOrder: booleanCoerce,
    notifyAdminsOnNewTicket: booleanCoerce,
  }),
});
