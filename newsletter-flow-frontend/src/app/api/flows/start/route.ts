import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { userId } = body

  try {
    const response = await fetch('https://newsletter-subscription-email-agrim.onrender.com/api/flows/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      throw new Error('Failed to start flow')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error starting flow:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
