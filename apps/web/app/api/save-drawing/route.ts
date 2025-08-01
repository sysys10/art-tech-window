import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { createSupabaseServerClient } from '@/lib/supabase'
import { withAuth } from '@/lib/auth-middleware'

/* ------------------------------------------------------------------ */
/* S3 클라이언트 초기화                                                */
/* ------------------------------------------------------------------ */
const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

/* ------------------------------------------------------------------ */
/* POST 핸들러 - 그림 저장                                             */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const supabase = createSupabaseServerClient()

      /* 1) 클라이언트 데이터 추출 */
      const { imageBase64, mimeType, name } = await req.json()

      if (!imageBase64 || !mimeType) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 },
        )
      }

      /* 2) Base64 → Buffer → S3 업로드 */
      const imageBuffer = Buffer.from(imageBase64, 'base64')
      const s3Key = `drawings/${uuidv4()}.png`

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: s3Key,
          Body: imageBuffer,
          ContentType: mimeType,
        }),
      )

      const s3Url = `https://${process.env.S3_BUCKET_NAME!}.s3.${process.env.S3_REGION!}.amazonaws.com/${s3Key}`

      /* 3) 사용자 그림 정보를 데이터베이스에 저장 */
      const { data: userImage, error: dbError } = await supabase
        .from('user_images')
        .insert({
          user_id: user.id,
          image_url: s3Url,
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json(
          { error: 'Database save failed' },
          { status: 500 },
        )
      }

      /* 4) 성공 응답 */
      return NextResponse.json({
        success: true,
        userImageId: userImage.id,
        imageUrl: s3Url,
        message: 'Drawing saved successfully',
      })
    } catch (err: any) {
      console.error('[Save Drawing Error]', err)
      return NextResponse.json(
        {
          error: 'Failed to save drawing',
          details: err?.message ?? 'unknown',
        },
        { status: 500 },
      )
    }
  })
}
