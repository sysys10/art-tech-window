# ART_TECH 해커톤 - 1조 프로젝트

## 🛠️ 프로젝트 실행 방법

1. 의존성 설치  
```bash
pnpm install
개발 서버 실행

bash
코드 복사
pnpm run web:dev
🔐 환경 변수 설정 (.env)
.env 파일에 아래 항목들을 추가해 주세요:

env
코드 복사
# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Replicate API Token
REPLICATE_API_TOKEN=your-replicate-api-token

# AWS S3 설정
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
S3_BUCKET_NAME=your-s3-bucket-name
S3_REGION=ap-northeast-2

# Google API Key
GOOGLE_API_KEY=your-google-api-key

# Kakao OAuth
NEXT_PUBLIC_KAKAO_REST_API_KEY=your-kakao-rest-api-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# 사이트 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
