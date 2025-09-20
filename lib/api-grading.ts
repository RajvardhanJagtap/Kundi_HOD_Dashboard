// src/lib/api-grading.ts
// API utility for managing grading data and Excel file operations

// Dynamic import for XLSX to avoid SSR issues
const getXLSX = async () => {
  if (typeof window === 'undefined') {
    // Server-side: return a mock to avoid import issues
    return null;
  }
  // Client-side: dynamically import XLSX
  const XLSX = await import('xlsx');
  return XLSX;
};

/**
 * Apply tint to a hex color
 * @param hexColor - Hex color string (e.g., "#FF0000")
 * @param tint - Tint value (-1 to 1, where -1 is darker, 1 is lighter)
 * @returns Modified hex color
 */
function applyTintToColor(hexColor: string, tint: number): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Apply tint
  const applyTint = (value: number, tint: number) => {
    if (tint > 0) {
      // Lighter - blend with white
      return Math.round(value + (255 - value) * tint)
    } else {
      // Darker - reduce brightness
      return Math.round(value * (1 + tint))
    }
  }
  
  const newR = Math.max(0, Math.min(255, applyTint(r, tint)))
  const newG = Math.max(0, Math.min(255, applyTint(g, tint)))
  const newB = Math.max(0, Math.min(255, applyTint(b, tint)))
  
  // Convert back to hex
  const toHex = (value: number) => value.toString(16).padStart(2, '0')
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
}

interface GradingSheetParams {
  yearId: string
  groupId: string
}

export interface CellStyling {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: string
  backgroundColor?: string
  fontSize?: number
  fontFamily?: string
  alignment?: 'left' | 'center' | 'right'
  wrapText?: boolean
  border?: string
  merged?: boolean
  mergeRange?: [number, number, number, number] // [startRow, startCol, endRow, endCol]
}

export interface CellData {
  value: string | number | boolean | null
  styling?: CellStyling
}

export interface ExcelSheetData {
  sheetName: string
  headers: string[]
  rows: (CellData | string | number | boolean | null)[][]
  totalRows: number
  mergedCells?: Array<{
    startRow: number
    startCol: number
    endRow: number
    endCol: number
    value: any
  }>
}

export interface ExcelPreviewData {
  sheets: ExcelSheetData[]
  filename: string
  fileSize: number
}

interface GradingSheetResponse {
  blob: Blob
  filename: string
}

/**
 * Fetches an Excel grading sheet from the API
 * @param params - The semester ID and group ID
 * @returns Promise with blob data and suggested filename
 */
export async function fetchGradingExcelSheet(params: GradingSheetParams): Promise<GradingSheetResponse> {
  const token = localStorage.getItem('accessToken')
  
  if (!token) {
    throw new Error('Authentication token not found. Please log in again.')
  }
  
  // Use the actual backend API endpoint
  const API_BASE_URL = 'https://ursmartmonitoring.ur.ac.rw/api/v1'

  const endpoint = `${API_BASE_URL}/grading/overall-sheets/generate-year-regular-sheet/${params.yearId}/group/${params.groupId}/excel`
  
  console.log('Fetching grading sheet from:', endpoint)
  
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    
    // Try to get more detailed error from response
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch {
      // If response is not JSON, use the status text
    }
    
    throw new Error(`Failed to fetch grading sheet: ${errorMessage}`)
  }

  const blob = await response.blob()
  
  // Generate filename based on parameters
  const shortYearId = params.yearId.slice(0, 8)
  const shortGroupId = params.groupId.slice(0, 8)
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `grading-sheet-${shortYearId}-${shortGroupId}-${timestamp}.xlsx`

  return {
    blob,
    filename
  }
}

/**
 * Downloads the Excel grading sheet directly
 * @param params - The semester ID and group ID
 * @returns Promise that resolves when download starts
 */
export async function downloadGradingExcelSheet(params: GradingSheetParams): Promise<string> {
  const { blob, filename } = await fetchGradingExcelSheet(params)
  
  // Create download URL and trigger download
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up URL after a delay
  setTimeout(() => {
    window.URL.revokeObjectURL(url)
  }, 100)

  return filename
}

/**
 * Parses Excel blob data into structured format for preview
 * @param blob - The Excel file blob
 * @param filename - The filename for the Excel file
 * @returns Promise with parsed Excel data
 * 
 * Enhanced Features:
 * - Full color extraction (RGB, Theme, Indexed colors)
 * - Proper merged cell handling with rowspan/colspan
 * - Rich formatting preservation (fonts, borders, alignment)
 * - Performance optimized parsing
 */
export async function parseExcelForPreview(blob: Blob, filename: string): Promise<ExcelPreviewData> {
  return new Promise(async (resolve, reject) => {
    try {
      // Get XLSX library dynamically
      const XLSX = await getXLSX();
      if (!XLSX) {
        throw new Error('XLSX library not available on server side');
      }

      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { 
            type: 'array',
            cellStyles: true,
            cellFormula: false,
            cellHTML: false
          })
        
          // Debug: Check if workbook has color information
          console.log('Workbook info:', {
          sheetNames: workbook.SheetNames,
          hasWorkbookProps: !!workbook.Workbook,
          firstSheet: workbook.SheetNames[0]
        })
        
        const sheets: ExcelSheetData[] = []
        
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName]
          
          // Debug: Check worksheet properties
          console.log(`Processing sheet: ${sheetName}`)
          console.log('Worksheet keys:', Object.keys(worksheet).filter(key => !key.startsWith('!')))
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null })
          
          // Extract merged cell ranges
          const mergedCells: Array<{
            startRow: number
            startCol: number
            endRow: number
            endCol: number
            value: any
          }> = []
          
          if (worksheet['!merges']) {
            worksheet['!merges'].forEach(merge => {
              const startRow = merge.s.r
              const startCol = merge.s.c
              const endRow = merge.e.r
              const endCol = merge.e.c
              
              // Get the value from the top-left cell of the merged range
              const cellAddress = XLSX.utils.encode_cell({ r: startRow, c: startCol })
              const cell = worksheet[cellAddress]
              const value = cell ? cell.v : null
              
              mergedCells.push({
                startRow,
                startCol,
                endRow,
                endCol,
                value
              })
            })
          }
          
          // Extract headers (first row)
          const headers = jsonData.length > 0 ? 
            (jsonData[0] as any[]).map(h => String(h || '').trim()) : []
          
          // Extract and process data rows with styling
          const rows: (CellData | string | number | boolean | null)[][] = []
          
          for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
            const row = jsonData[rowIndex] as any[]
            const processedRow: (CellData | string | number | boolean | null)[] = []
            
            for (let colIndex = 0; colIndex < Math.max(headers.length, row.length); colIndex++) {
              const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })
              const cell = worksheet[cellAddress]
              const rawValue = colIndex < row.length ? row[colIndex] : null
              
              // Debug: Check specific cells that should have colors (first row and some data cells)
              if (rowIndex <= 2 && colIndex <= 10) {
                console.log(`Checking cell ${cellAddress}:`, {
                  value: rawValue,
                  hasCell: !!cell,
                  hasStyle: !!cell?.s,
                  style: cell?.s
                })
              }
              
              // Check if this cell is part of a merged range
              const mergedInfo = mergedCells.find(merge => 
                rowIndex >= merge.startRow && rowIndex <= merge.endRow &&
                colIndex >= merge.startCol && colIndex <= merge.endCol
              )
              
              // Extract cell styling if available
              let styling: CellStyling | undefined = undefined
              
              if (cell?.s) {
                const cellStyle = cell.s
                styling = {} // Initialize empty styling object
                
                // Debug logging for color extraction
                if (cellStyle.fill || cellStyle.font?.color) {
                  console.log(`Cell ${cellAddress}:`, {
                    fill: cellStyle.fill,
                    fontColor: cellStyle.font?.color,
                    rawValue: rawValue
                  })
                }
                
                // Font styling
                if (cellStyle.font) {
                  if (cellStyle.font.bold) styling.bold = true
                  if (cellStyle.font.italic) styling.italic = true
                  if (cellStyle.font.underline) styling.underline = true
                  
                  // Enhanced color extraction from Excel
                  if (cellStyle.font.color) {
                    console.log(`Font color for ${cellAddress}:`, cellStyle.font.color)
                    
                    if (cellStyle.font.color.rgb) {
                      // RGB color format (most common)
                      const rgb = cellStyle.font.color.rgb
                      styling.color = rgb.startsWith('#') ? rgb : `#${rgb}`
                      console.log(`Applied RGB font color: ${styling.color}`)
                    } else if (cellStyle.font.color.theme !== undefined) {
                      // Theme color - convert to approximate hex values with tint support
                      const themeColors: { [key: number]: string } = {
                        0: '#000000', // Text 1 (Black)
                        1: '#FFFFFF', // Background 1 (White)
                        2: '#1F497D', // Text 2 (Dark Blue)
                        3: '#EEECE1', // Background 2 (Tan)
                        4: '#4F81BD', // Accent 1 (Blue) - Enhanced for Excel headers
                        5: '#9CBB58', // Accent 2 (Green)
                        6: '#F79646', // Accent 3 (Orange)
                        7: '#8064A2', // Accent 4 (Purple)
                        8: '#4BACC6', // Accent 5 (Aqua)
                        9: '#F2F2F2', // Accent 6 (Light Gray)
                        10: '#026892', // Hyperlink (Professional Blue - matching theme)
                        11: '#800080', // Followed Hyperlink (Purple)
                        // Enhanced mapping for common Excel patterns
                        12: '#5B9BD5', // Light Blue variant
                        13: '#FFFF99', // Light Yellow variant
                        14: '#366092', // Header Blue
                        15: '#FFEAA7'  // Light Yellow background
                      }
                      let color = themeColors[cellStyle.font.color.theme] || '#000000'
                      console.log(`Theme color ${cellStyle.font.color.theme} mapped to: ${color}`)
                      
                      // Apply tint if present (makes colors lighter/darker)
                      if (cellStyle.font.color.tint !== undefined) {
                        color = applyTintToColor(color, cellStyle.font.color.tint)
                        console.log(`Applied tint ${cellStyle.font.color.tint}, result: ${color}`)
                      }
                      
                      styling.color = color
                    } else if (cellStyle.font.color.indexed !== undefined) {
                      // Indexed color - comprehensive color palette
                      const indexedColors: { [key: number]: string } = {
                        8: '#000000',   // Black
                        9: '#FFFFFF',   // White
                        10: '#FF0000',  // Red
                        11: '#00FF00',  // Bright Green
                        12: '#0000FF',  // Blue
                        13: '#FFFF00',  // Yellow
                        14: '#FF00FF',  // Magenta
                        15: '#00FFFF',  // Cyan
                        16: '#800000',  // Dark Red
                        17: '#008000',  // Green
                        18: '#000080',  // Dark Blue
                        19: '#808000',  // Olive
                        20: '#800080',  // Purple
                        21: '#008080',  // Teal
                        22: '#C0C0C0',  // Silver
                        23: '#808080',  // Gray
                        24: '#9999FF',  // Light Blue
                        25: '#993366',  // Plum
                        26: '#FFFFCC',  // Light Yellow - Enhanced for Excel backgrounds
                        27: '#CCFFFF',  // Light Turquoise
                        28: '#660066',  // Dark Purple
                        29: '#FF8080',  // Light Red
                        30: '#0066CC',  // Medium Blue
                        31: '#CCCCFF',  // Very Light Blue
                        // Enhanced Excel-specific colors
                        32: '#366092',  // Header Blue (Excel style)
                        33: '#FFFF99',  // Light Yellow (Excel style) 
                        34: '#026892',  // Professional Blue
                        35: '#FFEAA7',  // Warm Yellow
                        36: '#5B9BD5',  // Excel Blue
                        37: '#D5E3F3',  // Light Excel Blue
                        38: '#FFF2CC',  // Light Excel Yellow
                        39: '#E2EFDA',  // Light Excel Green
                        40: '#FCE4D6',  // Light Excel Orange
                        41: '#DEEBF7',  // Very Light Blue
                        42: '#F2F2F2'   // Light Gray
                      }
                      styling.color = indexedColors[cellStyle.font.color.indexed] || '#000000'
                    }
                  }
                  
                  if (cellStyle.font.sz) styling.fontSize = cellStyle.font.sz
                  if (cellStyle.font.name) styling.fontFamily = cellStyle.font.name
                }
                
                // Enhanced fill/background color extraction with fallbacks
                if (cellStyle.fill) {
                  console.log(`Fill data for ${cellAddress}:`, cellStyle.fill)
                  
                  if (cellStyle.fill.fgColor?.rgb) {
                    // RGB background color
                    const rgb = cellStyle.fill.fgColor.rgb
                    styling.backgroundColor = rgb.startsWith('#') ? rgb : `#${rgb}`
                    console.log(`Applied RGB background color: ${styling.backgroundColor}`)
                  } else if (cellStyle.fill.fgColor?.theme !== undefined) {
                    // Theme background color with tint support
                    const themeColors: { [key: number]: string } = {
                      0: '#000000', // Text 1 (Black)
                      1: '#FFFFFF', // Background 1 (White)
                      2: '#1F497D', // Text 2 (Dark Blue)
                      3: '#EEECE1', // Background 2 (Tan)
                      4: '#4F81BD', // Accent 1 (Blue) - Enhanced for Excel headers
                      5: '#9CBB58', // Accent 2 (Green)
                      6: '#F79646', // Accent 3 (Orange)
                      7: '#8064A2', // Accent 4 (Purple)
                      8: '#4BACC6', // Accent 5 (Aqua)
                      9: '#F2F2F2', // Accent 6 (Light Gray)
                      10: '#026892', // Hyperlink (Professional Blue - matching theme)
                      11: '#800080', // Followed Hyperlink (Purple)
                      // Enhanced mapping for common Excel background patterns
                      12: '#5B9BD5', // Light Blue variant
                      13: '#FFFF99', // Light Yellow variant
                      14: '#366092', // Header Blue background
                      15: '#FFEAA7', // Light Yellow background
                      16: '#D5E3F3', // Very Light Blue background
                      17: '#FFF2CC', // Very Light Yellow background
                    }
                    let color = themeColors[cellStyle.fill.fgColor.theme] || '#FFFFFF'
                    console.log(`Background theme color ${cellStyle.fill.fgColor.theme} mapped to: ${color}`)
                    
                    // Apply tint if present
                    if (cellStyle.fill.fgColor.tint !== undefined) {
                      color = applyTintToColor(color, cellStyle.fill.fgColor.tint)
                      console.log(`Applied background tint ${cellStyle.fill.fgColor.tint}, result: ${color}`)
                    }
                    
                    styling.backgroundColor = color
                  } else if (cellStyle.fill.fgColor?.indexed !== undefined) {
                    // Indexed background color - comprehensive palette
                    const indexedColors: { [key: number]: string } = {
                      8: '#000000',   // Black
                      9: '#FFFFFF',   // White
                      10: '#FF0000',  // Red
                      11: '#00FF00',  // Bright Green
                      12: '#0000FF',  // Blue
                      13: '#FFFF00',  // Yellow
                      14: '#FF00FF',  // Magenta
                      15: '#00FFFF',  // Cyan
                      16: '#800000',  // Dark Red
                      17: '#008000',  // Green
                      18: '#000080',  // Dark Blue
                      19: '#808000',  // Olive
                      20: '#800080',  // Purple
                      21: '#008080',  // Teal
                      22: '#C0C0C0',  // Silver
                      23: '#808080',  // Gray
                      24: '#9999FF',  // Light Blue
                      25: '#993366',  // Plum
                      26: '#FFFFCC',  // Light Yellow - Enhanced for Excel backgrounds
                      27: '#CCFFFF',  // Light Turquoise
                      28: '#660066',  // Dark Purple
                      29: '#FF8080',  // Light Red
                      30: '#0066CC',  // Medium Blue
                      31: '#CCCCFF',  // Very Light Blue
                      // Enhanced Excel background colors
                      32: '#366092',  // Header Blue background
                      33: '#FFFF99',  // Light Yellow background (Excel style) 
                      34: '#026892',  // Professional Blue background
                      35: '#FFEAA7',  // Warm Yellow background
                      36: '#5B9BD5',  // Excel Blue background
                      37: '#D5E3F3',  // Light Excel Blue background
                      38: '#FFF2CC',  // Light Excel Yellow background
                      39: '#E2EFDA',  // Light Excel Green background
                      40: '#FCE4D6',  // Light Excel Orange background
                      41: '#DEEBF7',  // Very Light Blue background
                      42: '#F2F2F2',  // Light Gray background
                      43: '#FFCCCC',  // Light Pink
                      44: '#CCFFCC',  // Light Green
                      45: '#CCFFFF',  // Light Cyan
                      46: '#FFCCFF',  // Light Magenta
                      47: '#FFCCCC',  // Light Red
                      48: '#FF6600',  // Orange
                      49: '#006699',  // Dark Cyan
                      50: '#CC6600',  // Brown
                      64: '#FFFFFF',  // Auto/System background
                    }
                    styling.backgroundColor = indexedColors[cellStyle.fill.fgColor.indexed] || '#FFFFFF'
                  } else if (cellStyle.fill.patternType && cellStyle.fill.patternType !== 'none') {
                    // Handle pattern fills - use a light gray as default for patterns
                    styling.backgroundColor = '#F0F0F0'
                  }
                }
                
                // Alignment
                if (cellStyle.alignment) {
                  if (cellStyle.alignment.horizontal) {
                    styling.alignment = cellStyle.alignment.horizontal as 'left' | 'center' | 'right'
                  }
                  if (cellStyle.alignment.wrapText) {
                    styling.wrapText = true
                  }
                }
                
                // Enhanced border handling
                if (cellStyle.border) {
                  // Check for any border (top, bottom, left, right)
                  const hasBorder = cellStyle.border.top || cellStyle.border.bottom || 
                                  cellStyle.border.left || cellStyle.border.right
                  if (hasBorder) {
                    styling.border = '1px solid #ccc' // Simplified border representation
                  }
                }
                
                // Additional fallback color detection for common Excel patterns
                if (!styling.backgroundColor && cellStyle.fill?.fgColor) {
                  // Try to extract any remaining color information
                  const fgColor = cellStyle.fill.fgColor
                  console.log(`Fallback color detection for ${cellAddress}:`, fgColor)
                  
                  if (typeof fgColor === 'object') {
                    // Check for any hex-like properties
                    const colorKeys = Object.keys(fgColor)
                    for (const key of colorKeys) {
                      const value = (fgColor as any)[key]
                      if (typeof value === 'string' && value.match(/^[0-9A-Fa-f]{6,8}$/)) {
                        styling.backgroundColor = value.startsWith('#') ? value : `#${value}`
                        console.log(`Applied fallback background color: ${styling.backgroundColor}`)
                        break
                      }
                    }
                  }
                }
                
                // Special handling for Excel 2007+ files that might store colors differently
                if (!styling.backgroundColor && !styling.color && cellStyle.fill?.patternType) {
                  console.log(`Pattern fill detected for ${cellAddress}:`, cellStyle.fill.patternType)
                  // For pattern fills, try to extract color from pattern
                  if (cellStyle.fill.patternType === 'solid' && cellStyle.fill.fgColor) {
                    // Sometimes solid patterns store color data differently
                    const patternColor = cellStyle.fill.fgColor
                    if (typeof patternColor === 'string') {
                      styling.backgroundColor = patternColor.startsWith('#') ? patternColor : `#${patternColor}`
                      console.log(`Applied pattern background color: ${styling.backgroundColor}`)
                    }
                  }
                }
              }
              
              // Debug: Log final styling object if it has colors
              if (styling && (styling.backgroundColor || styling.color)) {
                console.log(`Final styling for ${cellAddress}:`, styling)
              }
              
              // Handle merged cells
              if (mergedInfo) {
                const isTopLeft = rowIndex === mergedInfo.startRow && colIndex === mergedInfo.startCol
                
                if (isTopLeft) {
                  // This is the main cell of the merged range
                  if (styling) {
                    styling.merged = true
                    styling.mergeRange = [
                      mergedInfo.startRow,
                      mergedInfo.startCol,
                      mergedInfo.endRow,
                      mergedInfo.endCol
                    ]
                  } else {
                    styling = {
                      merged: true,
                      mergeRange: [
                        mergedInfo.startRow,
                        mergedInfo.startCol,
                        mergedInfo.endRow,
                        mergedInfo.endCol
                      ]
                    }
                  }
                  
                  processedRow.push({
                    value: mergedInfo.value,
                    styling
                  })
                } else {
                  // This cell is part of a merged range but not the top-left
                  // Mark it as null so it can be skipped during rendering
                  processedRow.push(null)
                }
              } else {
                // Regular cell
                if (styling && Object.keys(styling).length > 0) {
                  processedRow.push({
                    value: rawValue,
                    styling
                  })
                } else {
                  processedRow.push(rawValue)
                }
              }
            }
            
            // Pad row to match header length
            while (processedRow.length < headers.length) {
              processedRow.push(null)
            }
            
            rows.push(processedRow.slice(0, headers.length))
          }
          
          // Remove header row from data rows
          const dataRows = rows.length > 1 ? rows.slice(1) : []
          
          sheets.push({
            sheetName,
            headers,
            rows: dataRows,
            totalRows: dataRows.length,
            mergedCells
          })
        })
        
        resolve({
          sheets,
          filename,
          fileSize: blob.size
        })
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'))
    }
    
    reader.readAsArrayBuffer(blob)
    } catch (error) {
      // Handle XLSX loading errors
      reject(error instanceof Error ? error : new Error('Failed to load Excel processing library'))
    }
  })
}

/**
 * Fetches and parses Excel grading sheet for preview
 * @param params - The semester ID and group ID
 * @returns Promise with parsed Excel data
 */
export async function fetchAndParseGradingSheet(params: GradingSheetParams): Promise<ExcelPreviewData> {
  // Validate parameters first
  validateGradingSheetParams(params)
  
  const { blob, filename } = await fetchGradingExcelSheet(params)
  return await parseExcelForPreview(blob, filename)
}

/**
 * Validates grading sheet parameters
 * @param params - The parameters to validate
 * @throws Error if parameters are invalid
 */
export function validateGradingSheetParams(params: GradingSheetParams): void {
  if (!params.yearId || typeof params.yearId !== 'string') {
    throw new Error('Academic Year ID is required. Please select a class from the main page to get valid data.')
  }
  
  if (!params.groupId || typeof params.groupId !== 'string') {
    throw new Error('Group ID is required. Please select a class from the main page to get valid group information.')
  }
  
  // Basic UUID format validation (optional but helpful)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  
  if (!uuidRegex.test(params.yearId)) {
    console.warn('Year ID does not appear to be a valid UUID format')
  }
  
  if (!uuidRegex.test(params.groupId)) {
    console.warn('Group ID does not appear to be a valid UUID format')
  }
}

/**
 * Formats file size in bytes to human readable format
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
