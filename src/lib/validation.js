import { z } from 'zod'

// Custom error class for validation errors
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

// Student validation schema
const studentSchema = z.object({
  student_id: z.string()
    .min(1, 'Student ID is required')
    .max(20, 'Student ID must be 20 characters or less')
    .regex(/^STU\d+$/, 'Student ID must start with "STU" followed by numbers'),

  first_name: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less')
    .trim(),

  last_name: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less')
    .trim(),

  site_id: z.string()
    .uuid('Invalid site selected'),

  grade: z.number()
    .int('Grade must be a whole number')
    .min(1, 'Grade must be between 1 and 12')
    .max(12, 'Grade must be between 1 and 12')
    .nullable()
    .optional(),

  risk_score: z.number()
    .min(0, 'Support level must be between 0 and 1')
    .max(1, 'Support level must be between 0 and 1')
    .nullable()
    .optional(),

  priority: z.enum(['high', 'medium', 'low'], {
    errorMap: () => ({ message: 'Priority must be high, medium, or low' })
  }).optional(),

  attendance_rate: z.number()
    .min(0, 'Attendance rate must be between 0 and 100')
    .max(100, 'Attendance rate must be between 0 and 100')
    .nullable()
    .optional(),

  homework_completion_rate: z.number()
    .min(0, 'Homework completion must be between 0 and 100')
    .max(100, 'Homework completion must be between 0 and 100')
    .nullable()
    .optional(),

  reading_level: z.number()
    .min(0, 'Reading level must be positive')
    .nullable()
    .optional(),

  math_level: z.number()
    .min(0, 'Math level must be positive')
    .nullable()
    .optional(),

  behavioral_incidents: z.number()
    .int('Check-in count must be a whole number')
    .min(0, 'Check-in count cannot be negative')
    .nullable()
    .optional(),

  mentor_engagement_score: z.number()
    .min(0, 'Engagement score must be between 0 and 5')
    .max(5, 'Engagement score must be between 0 and 5')
    .nullable()
    .optional(),

  strengths: z.string()
    .max(500, 'Strengths must be 500 characters or less')
    .nullable()
    .optional(),

  concerns: z.string()
    .max(500, 'Areas for growth must be 500 characters or less')
    .nullable()
    .optional(),

  recommended_actions: z.string()
    .max(500, 'Support strategies must be 500 characters or less')
    .nullable()
    .optional(),

  notes: z.string()
    .max(1000, 'Notes must be 1000 characters or less')
    .nullable()
    .optional(),

  last_contact_date: z.string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format'
    })
    .nullable()
    .optional(),

  active: z.boolean()
    .optional()
})

// Validate student data
export function validateStudent(data) {
  try {
    const validated = studentSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      throw new ValidationError(
        firstError.message,
        firstError.path.join('.')
      )
    }
    throw error
  }
}

// Sanitize text input to prevent XSS
export function sanitizeText(text) {
  if (!text) return text

  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

// Parse comma-separated values safely
export function parseCommaSeparated(value) {
  if (!value || typeof value !== 'string') return []

  return value
    .split(',')
    .map(item => sanitizeText(item))
    .filter(item => item.length > 0)
}

// Validate and parse form data for submission
export function prepareStudentData(formData) {
  // Parse numeric fields
  const parsed = {
    ...formData,
    grade: formData.grade ? parseInt(formData.grade, 10) : null,
    risk_score: formData.risk_score ? parseFloat(formData.risk_score) : null,
    attendance_rate: formData.attendance_rate ? parseFloat(formData.attendance_rate) : null,
    homework_completion_rate: formData.homework_completion_rate ? parseFloat(formData.homework_completion_rate) : null,
    reading_level: formData.reading_level ? parseFloat(formData.reading_level) : null,
    math_level: formData.math_level ? parseFloat(formData.math_level) : null,
    behavioral_incidents: formData.behavioral_incidents ? parseInt(formData.behavioral_incidents, 10) : 0,
    mentor_engagement_score: formData.mentor_engagement_score ? parseFloat(formData.mentor_engagement_score) : null,
  }

  // Validate
  const { data } = validateStudent(parsed)

  // Convert comma-separated strings to arrays for database
  return {
    ...data,
    strengths: parseCommaSeparated(formData.strengths),
    concerns: parseCommaSeparated(formData.concerns),
    recommended_actions: parseCommaSeparated(formData.recommended_actions),
    notes: sanitizeText(formData.notes)
  }
}
