import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { flowId } = body

  try {
    const response = await fetch('http://localhost:5000/api/flows/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flowId }),
    })

    if (!response.ok) {
      throw new Error('Failed to simulate flow')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error simulating flow:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

