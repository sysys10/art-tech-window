import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { nickname, age, gender } = req.body
  } catch (err: any) {
    NextResponse.json(
      {
        error: 'Image generation failed',
        details: err?.message ?? 'unknown',
      },
      { status: 500 },
    )
  }
}
