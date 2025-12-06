export type Conversation = {
  id: string;
  type?: string;
  booking_id?: string;
  created_at?: string;
};

// Placeholder message utilities; implement real-time chat as needed.
export const createConversation = async (
  _customerId: string,
  _professionalId: string,
  _bookingId?: string
): Promise<Conversation> => {
  return {
    id: `conv_${Math.random().toString(36).slice(2)}`,
    booking_id: _bookingId,
    created_at: new Date().toISOString(),
  };
};
