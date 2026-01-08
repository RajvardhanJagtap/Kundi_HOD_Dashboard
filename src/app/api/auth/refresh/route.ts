import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../../lib/api';

const API_BASE_URL = api.defaults.baseURL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Return the exact response from the backend API
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy refresh error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
