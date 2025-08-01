import { NextRequest } from 'next/server'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

// Google 인증 초기화
const client = new TextToSpeechClient({
  credentials: JSON.parse(process.env.GCP_TTS_KEY as string),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: '텍스트가 필요합니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: 'ko-KR',
        name: 'ko-KR-Chirp3-HD-Leda',
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
      },
    })

    if (!response.audioContent) {
      return new Response(JSON.stringify({ error: '음성 생성 실패' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(Buffer.from(response.audioContent), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="tts.mp3"',
      },
    })
  } catch (err) {
    console.error('TTS API Error:', err)
    return new Response(JSON.stringify({ error: '서버 오류' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
