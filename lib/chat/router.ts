import { createConversation } from "./messages";

// Lightweight stubs for booking/support conversations.
export const getOrCreateBookingConversation = async (
  _supabase: any,
  customerId: string,
  bookingId: string,
  professionalId: string
) => {
  const conv = await createConversation(customerId, professionalId, bookingId);
  return conv.id;
};

export const getOrCreateSupportConversation = async (_supabase: any, userId: string) => {
  const conv = await createConversation(userId, "support");
  return conv.id;
};
