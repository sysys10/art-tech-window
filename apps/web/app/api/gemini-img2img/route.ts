import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, Modality } from '@google/genai'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { createSupabaseServerClient } from '@/lib/supabase'
import { withAuth } from '@/lib/auth-middleware'

/* ------------------------------------------------------------------ */
/* 1)  클라이언트 & S3 초기화                                          */
/* ------------------------------------------------------------------ */
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

/* 고정 프롬프트 ------------------------------------------------------ */
const prompt = `
Transform the input image into a bright, dreamlike outdoor scene with a soft and ethereal atmosphere.
Remove all unnecessary or complex elements.
natural features such as a glowing sky, gentle trees, distant misty mountains, or serene grassy fields.
The composition should be airy, uncluttered, and inspired by peaceful nature.
Soft lighting, pastel tones, and a subtle glow are encouraged.
`.trim()

/* ------------------------------------------------------------------ */
/* 2) POST 핸들러                                                     */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const supabase = createSupabaseServerClient()

      /* 2‑1) 클라이언트 데이터 추출 */
      const { imageBase64, mimeType, userImageId, emotionTags } =
        await req.json()
      if (!imageBase64 || !mimeType || !userImageId) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 },
        )
      }

      /* 2‑2) Gemini 호출 (img2img) */
      const contents = [
        { text: prompt },
        { inlineData: { mimeType, data: imageBase64 } },
      ]

      const genRes = (await genAI.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents,
        config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
      })) as any

      const part = genRes.candidates[0]?.content?.parts.find(
        (p: any) => 'inlineData' in p,
      )
      if (!part?.inlineData?.data) {
        return NextResponse.json(
          { error: 'No image returned by model' },
          { status: 500 },
        )
      }

      /* 2‑3) Base64 → Buffer → S3 업로드 */
      const outputBase64 = part.inlineData.data
      const outBuffer = Buffer.from(outputBase64, 'base64')
      const s3Key = `outputs/${uuidv4()}.png`

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: s3Key,
          Body: outBuffer,
          ContentType: 'image/png',
        }),
      )

      const s3Url = `https://${process.env.S3_BUCKET_NAME!}.s3.${process.env
        .S3_REGION!}.amazonaws.com/${s3Key}`

      /* 2‑4) 생성된 이미지 정보를 데이터베이스에 저장 */
      const { data: generatedImage, error: dbError } = await supabase
        .from('generated_images')
        .insert({
          user_image_id: userImageId,
          prompt: prompt,
          generated_url: s3Url,
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

      /* 2‑5) 감정 태그와 생성된 이미지 매핑 */
      if (emotionTags && emotionTags.length > 0) {
        for (const emotionId of emotionTags) {
          await supabase.from('image_emotions').insert({
            generated_id: generatedImage.id,
            emotion_id: emotionId,
          })
        }
      }

      /* 2‑6) 응답 */
      return NextResponse.json({
        imageUrl: s3Url,
        success: true,
        generatedImageId: generatedImage.id,
      })
    } catch (err: any) {
      console.error('[Gemini Error]', err)
      return NextResponse.json(
        {
          error: 'Image generation failed',
          details: err?.message ?? 'unknown',
        },
        { status: 500 },
      )
    }
  })
}
