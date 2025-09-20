"use server"

export interface AssignmentInput {
  year: string
  semester: string
  moduleCode: string
  lecturerId: string
}

export interface AssignmentResult {
  success: boolean
  message: string
}

// Stub server action to integrate real persistence later
export async function assignModule(
  prevState: AssignmentResult | null,
  formData: FormData,
): Promise<AssignmentResult> {
  await new Promise((r) => setTimeout(r, 600))

  const year = String(formData.get("year") || "")
  const semester = String(formData.get("semester") || "")
  const moduleCode = String(formData.get("moduleCode") || "")
  const lecturerId = String(formData.get("lecturerId") || "")

  if (!year || !semester || !moduleCode || !lecturerId) {
    return { success: false, message: "All fields are required." }
  }

  // In a real app, persist to DB and handle conflicts here
  console.log(`[assignModule] ${year} ${semester} | ${moduleCode} -> ${lecturerId}`)
  const ok = Math.random() > 0.05
  return ok
    ? { success: true, message: `Assigned ${moduleCode} to lecturer ${lecturerId}.` }
    : { success: false, message: "Failed to assign module. Try again." }
}

