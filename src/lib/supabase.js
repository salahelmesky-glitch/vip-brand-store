import { createClient } from '@supabase/supabase-js'

// إحنا هنحط روابط وهمية بس بتركيبة صح عشان الموقع يفتح
const supabaseUrl = 'https://aeidmclvptqwertyuiop.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey'

export const supabase = createClient(supabaseUrl, supabaseKey)