import { createClient } from '@supabase/supabase-js'

// 환경변수에서 URL과 키를 가져와서 Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
// 이제 다른 파일에서 import { supabase } from '@/lib/supabase' 로 사용 가능