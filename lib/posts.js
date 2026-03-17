import { supabase } from './supabase'

// 글 목록 전체 가져오기 (메인 페이지용)
export async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, title, tag, description, distance, time, pace, created_at')
    // 목록에 필요한 컬럼만 가져오기 (content 제외 → 용량 절약)
    .eq('published', true)              // 공개된 글만
    .order('created_at', { ascending: false }) // 최신순

    console.log('data:', data)   // ← 이 줄 추가
    console.log('error:', error) // ← 이 줄 추가

  if (error) {
    console.error('글 목록 불러오기 실패:', error)
    return []
  }

  return data
}

// 글 1개 가져오기 (상세 페이지용)
export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')               // 모든 컬럼 (content 포함)
    .eq('slug', slug)          // slug 일치하는 글
    .single()                  // 1개만

  if (error) {
    console.error('글 불러오기 실패:', error)
    return null
  }

  return data
}

// 조회수 +1
export async function incrementViews(slug) {
  await supabase.rpc('increment_views', { post_slug: slug })
  // rpc : Supabase 에 만들어둔 SQL 함수 호출
}

// 좋아요 +1
export async function incrementLikes(slug) {
  await supabase.rpc('increment_likes', { post_slug: slug })
}

