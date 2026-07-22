export type Message = {
  id: string
  senderId: string
  senderName: string
  // Emoji avatar copied from the sender's profile; empty means render initials.
  avatarEmoji: string
  text: string
  // Epoch milliseconds; formatted for display at render time.
  timestamp: number
}
