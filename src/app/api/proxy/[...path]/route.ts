// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://ursmartmonitoring.ur.ac.rw/api/v1'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params
    console.log('Proxy received request:', {
      path: resolvedParams.path,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries())
    })

    const { path } = resolvedParams
    const searchParams = request.nextUrl.searchParams
    const pathString = Array.isArray(path) ? path.join('/') : path
    
    // Build the target URL - FIXED: ensure proper path construction
    const targetUrl = new URL(`${API_BASE_URL}/${pathString}`)
    
    // Copy search params (except token which we handle separately)
    searchParams.forEach((value, key) => {
      if (key !== 'token') {
        targetUrl.searchParams.append(key, value)
      }
    })
    
    console.log('Proxying to URL:', targetUrl.toString())
    
    // Get authorization token from various sources
    const authHeader = request.headers.get('authorization')
    const xAccessToken = request.headers.get('x-access-token')
    const tokenParam = searchParams.get('token')
    
    // Prepare headers for the backend request
    const headers: HeadersInit = {
      'Accept': request.headers.get('accept') || 'application/pdf, application/json, */*',
      'Content-Type': request.headers.get('content-type') || 'application/json',
      'User-Agent': 'NextJS-Proxy/1.0',
      'Cache-Control': 'no-cache',
    }
    
    // Add authorization - try different methods
    if (authHeader) {
      headers['Authorization'] = authHeader
    } else if (xAccessToken) {
      headers['Authorization'] = `Bearer ${xAccessToken}`
    } else if (tokenParam) {
      headers['Authorization'] = `Bearer ${tokenParam}`
    }
    
    console.log('Request headers:', headers)
    
    // Make the request to the backend API
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store',
    })
    
    console.log('Backend response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    if (!response.ok) {
      let errorMessage = `Backend API returned ${response.status}`
      
      try {
        const errorText = await response.text()
        if (errorText) {
          errorMessage += `: ${errorText}`
        }
      } catch (e) {
        // Ignore parsing errors
      }
      
      console.error('Backend error:', errorMessage)
      
      return NextResponse.json(
        { 
          error: errorMessage,
          status: response.status,
          url: targetUrl.toString()
        },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Access-Token',
          }
        }
      )
    }
    
    // Get the response data
    const contentType = response.headers.get('content-type') || ''
    console.log('Response content type:', contentType)
    
    if (contentType.includes('application/pdf')) {
      // Handle PDF response
      const pdfBuffer = await response.arrayBuffer()
      console.log('PDF buffer size:', pdfBuffer.byteLength)
      
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBuffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Access-Token',
        }
      })
    } else if (contentType.includes('application/json')) {
      // Handle JSON response
      const jsonData = await response.json()
      
      return NextResponse.json(jsonData, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Access-Token',
        }
      })
    } else {
      // Handle other response types
      const responseData = await response.arrayBuffer()
      
      return new NextResponse(responseData, {
        status: 200,
        headers: {
          'Content-Type': contentType || 'application/octet-stream',
          'Content-Length': responseData.byteLength.toString(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Access-Token',
        }
      })
    }
    
  } catch (error: any) {
    console.error('Proxy error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return NextResponse.json(
      { 
        error: 'Proxy server error',
        details: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Access-Token',
        }
      }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Requested-With, X-Access-Token',
      'Access-Control-Max-Age': '86400',
    },
  })
}