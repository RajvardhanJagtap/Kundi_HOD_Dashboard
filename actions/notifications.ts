"use server"

interface NotificationState {
  success: boolean
  message: string
}

export async function sendNotification(
  prevState: NotificationState | null,
  formData: FormData,
): Promise<NotificationState> {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  const recipientType = formData.get("recipientType") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  if (!recipientType || !subject || !message) {
    return { success: false, message: "All fields are required." }
  }

  // In a real application, you would integrate with an email service,
  // push notification service, or database here.
  console.log(`Sending notification to: ${recipientType}`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)

  // Simulate success or failure
  const success = Math.random() > 0.1 // 90% chance of success
  if (success) {
    return { success: true, message: `Notification sent successfully to ${recipientType}!` }
  } else {
    return { success: false, message: "Failed to send notification. Please try again." }
  }
}
