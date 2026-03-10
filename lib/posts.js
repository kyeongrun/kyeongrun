import fs from "fs";
// fs = File System, Node.js 내장 모듈이에요
// 파일을 읽고 쓰는 기능을 제공해요

import path from "path";
// path = 파일 경로를 다루는 Node.js 내장 모듈이에요

import matter from "gray-matter";
// gray-matter = Markdown 파일의 메타데이터를 읽어오는 패키지예요

const postsDirectory = path.join(process.cwd(), "posts");
// process.cwd() = 현재 프로젝트 루트 경로예요
// path.join = 경로를 합쳐줘요
// 결과: /kyeongrun/posts 경로를 저장해요

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  // readdirSync = posts 폴더 안의 파일 목록을 읽어와요
  // 결과: ["first-run.md"] 같은 배열이에요

  const posts = fileNames.map((fileName) => {
    // map = 배열의 각 항목을 변환해요

    const slug = fileName.replace(".md", "");
    // slug = URL에 사용할 이름이에요
    // first-run.md → first-run 으로 변환해요

    const fullPath = path.join(postsDirectory, fileName);
    // 파일의 전체 경로를 만들어요
    // 결과: /kyeongrun/posts/first-run.md

    const fileContents = fs.readFileSync(fullPath, "utf8");
    // 파일 내용을 문자열로 읽어와요

    const { data } = matter(fileContents);
    // matter = Markdown 파일을 파싱해요
    // data = --- 사이의 메타데이터예요 (title, date, description, tag)

    return {
      slug,
      ...data,
      // slug와 메타데이터를 합쳐서 반환해요
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  // 날짜 기준으로 최신순 정렬해요
}

export function getPostBySlug(slug) {
  // slug로 특정 글을 가져오는 함수예요

  const fullPath = path.join(postsDirectory, `${slug}.md`);
  // slug로 파일 경로를 만들어요
  // 결과: /kyeongrun/posts/first-run.md

  const fileContents = fs.readFileSync(fullPath, "utf8");
  // 파일 내용을 읽어와요

  const { data, content } = matter(fileContents);
  // data = 메타데이터 (title, date 등)
  // content = 실제 Markdown 본문 내용이에요

  return { slug, ...data, content };
  // slug, 메타데이터, 본문을 합쳐서 반환해요
}