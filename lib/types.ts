// =============================================
// Database Types matching Supabase schema
// =============================================

export interface Service {
  id: string
  slug: string
  icon: string
  name: string
  name_th: string | null
  description: string | null
  description_th: string | null
  price_range: string | null
  price_amount: number
  duration_minutes: number
  category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  slug: string
  initials: string
  name: string
  name_th: string | null
  specialty: string
  specialty_th: string | null
  qualifications: string | null
  experience_years: number
  bio: string | null
  image_url: string | null
  availability: Record<string, string[]>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  patient_name: string
  patient_email: string
  patient_phone: string | null
  service_id: string | null
  service_name: string | null
  doctor_id: string | null
  doctor_name: string | null
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes: string | null
  confirmation_sent: boolean
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  session_id: string
  messages: ChatMessage[]
  patient_name: string | null
  patient_email: string | null
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

// API Request/Response types
export interface BookingRequest {
  patient_name: string
  patient_email: string
  patient_phone?: string
  service_id?: string
  service_name?: string
  doctor_id?: string
  doctor_name?: string
  appointment_date: string
  appointment_time: string
  notes?: string
}

export interface ContactRequest {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface ChatRequest {
  message: string
  session_id: string
  history: ChatMessage[]
}
