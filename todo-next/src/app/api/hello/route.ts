import { NextResponse } from 'next/server'

// 💡 GETリクエスト（データをちょうだいという合図）が来たらJSONを返す
export async function GET() {
  return NextResponse.json({ 
    message: 'Hello from Next.js API! 🚀',
    status: 'success'
  })
}