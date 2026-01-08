// src/lib/api-grading.ts
// API utility for managing grading data and Excel file operations

import { api } from "./api"

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
  alignment?: "left" | "center" | "right"
  wrapText?: boolean
  border?: string
  merged?: boolean
  mergeRange?: [number, number, number, number] // [startRow, startCol, endRow, endCol]
  comment?: string
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
 * Convert ARGB hex color to standard hex color
 * ExcelJS returns colors in ARGB format (e.g., "FF4F81BD" where FF is alpha)
 */
function argbToHex(argb: string | undefined): string | undefined {
  if (!argb) return undefined
  // Remove alpha channel if present (first 2 characters)
  const hex = argb.length === 8 ? argb.substring(2) : argb
  return `#${hex}`
}

/**
 * Extract color from ExcelJS color object
 */
function extractColor(color: any): string | undefined {
  if (!color) return undefined

  // Direct ARGB color
  if (color.argb) {
    return argbToHex(color.argb)
  }

  // Theme color with tint
  if (color.theme !== undefined) {
    // Excel theme colors - approximate values
    const themeColors: { [key: number]: string } = {
      0: "#000000", // Dark 1 (typically black)
      1: "#FFFFFF", // Light 1 (typically white)
      2: "#1F497D", // Dark 2
      3: "#EEECE1", // Light 2
      4: "#4F81BD", // Accent 1 (Blue)
      5: "#C0504D", // Accent 2 (Red)
      6: "#9BBB59", // Accent 3 (Green)
      7: "#8064A2", // Accent 4 (Purple)
      8: "#4BACC6", // Accent 5 (Aqua)
      9: "#F79646", // Accent 6 (Orange)
    }

    let baseColor = themeColors[color.theme] || "#000000"

    // Apply tint if present
    if (color.tint !== undefined && color.tint !== 0) {
      baseColor = applyTintToColor(baseColor, color.tint)
    }

    return baseColor
  }

  // Indexed color
  if (color.indexed !== undefined) {
    const indexedColors: { [key: number]: string } = {
      0: "#000000",
      1: "#FFFFFF",
      2: "#FF0000",
      3: "#00FF00",
      4: "#0000FF",
      5: "#FFFF00",
      6: "#FF00FF",
      7: "#00FFFF",
      8: "#000000",
      9: "#FFFFFF",
      10: "#FF0000",
      11: "#00FF00",
      12: "#0000FF",
      13: "#FFFF00",
      14: "#FF00FF",
      15: "#00FFFF",
      16: "#800000",
      17: "#008000",
      18: "#000080",
      19: "#808000",
      20: "#800080",
      21: "#008080",
      22: "#C0C0C0",
      23: "#808080",
      24: "#9999FF",
      25: "#993366",
      26: "#FFFFCC",
      27: "#CCFFFF",
      28: "#660066",
      29: "#FF8080",
      30: "#0066CC",
      31: "#CCCCFF",
      32: "#000080",
      33: "#FF00FF",
      34: "#FFFF00",
      35: "#00FFFF",
      36: "#800080",
      37: "#800000",
      38: "#008080",
      39: "#0000FF",
      40: "#00CCFF",
      41: "#CCFFFF",
      42: "#CCFFCC",
      43: "#FFFF99",
      44: "#99CCFF",
      45: "#FF99CC",
      46: "#CC99FF",
      47: "#FFCC99",
      48: "#3366FF",
      49: "#33CCCC",
      50: "#99CC00",
      51: "#FFCC00",
      52: "#FF9900",
      53: "#FF6600",
      54: "#666699",
      55: "#969696",
      56: "#003366",
      57: "#339966",
      58: "#003300",
      59: "#333300",
      60: "#993300",
      61: "#993366",
      62: "#333399",
      63: "#333333",
      64: "#000000", // System foreground
      65: "#FFFFFF", // System background
    }
    return indexedColors[color.indexed] || "#000000"
  }

  return undefined
}

/**
 * Apply tint to a hex color
 */
function applyTintToColor(hexColor: string, tint: number): string {
  const hex = hexColor.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)

  const applyTint = (value: number, tint: number) => {
    if (tint > 0) {
      return Math.round(value + (255 - value) * tint)
    } else {
      return Math.round(value * (1 + tint))
    }
  }

  const newR = Math.max(0, Math.min(255, applyTint(r, tint)))
  const newG = Math.max(0, Math.min(255, applyTint(g, tint)))
  const newB = Math.max(0, Math.min(255, applyTint(b, tint)))

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

/**
 * Fetches an Excel grading sheet from the API
 */
export async function fetchGradingExcelSheet(params: GradingSheetParams): Promise<GradingSheetResponse> {
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return null
  }

  const token = getCookie("accessToken")

  if (!token) {
    throw new Error("Authentication token not found. Please log in again.")
  }

  const endpoint = `/grading/overall-sheets/generate-year-regular-sheet/${params.yearId}/group/${params.groupId}/excel`

  console.log("Fetching grading sheet from:", endpoint)

  const response = await api.get(endpoint, {
    responseType: 'blob'
  })

  if (!response.data) {
    throw new Error('No data received from server')
  }

  const blob = response.data

  const shortYearId = params.yearId.slice(0, 8)
  const shortGroupId = params.groupId.slice(0, 8)
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `grading-sheet-${shortYearId}-${shortGroupId}-${timestamp}.xlsx`

  return { blob, filename }
}

/**
 * Downloads the Excel grading sheet directly
 */
export async function downloadGradingExcelSheet(params: GradingSheetParams): Promise<string> {
  const { blob, filename } = await fetchGradingExcelSheet(params)

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.style.display = "none"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  setTimeout(() => window.URL.revokeObjectURL(url), 100)

  return filename
}

/**
 * Parses Excel blob data into structured format for preview using ExcelJS
 * Complete rewrite using ExcelJS for proper style and comment extraction
 */
export async function parseExcelForPreview(blob: Blob, filename: string): Promise<ExcelPreviewData> {
  if (typeof window === "undefined") {
    throw new Error("Excel parsing is only available in the browser")
  }

  // Dynamically import ExcelJS
  const ExcelJS = await import("exceljs")

  const arrayBuffer = await blob.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  console.log("ExcelJS Workbook loaded:", {
    sheetCount: workbook.worksheets.length,
    sheetNames: workbook.worksheets.map((ws) => ws.name),
  })

  const sheets: ExcelSheetData[] = []

  workbook.eachSheet((worksheet, sheetId) => {
    console.log(`Processing sheet: ${worksheet.name}`)

    const mergedCells: Array<{
      startRow: number
      startCol: number
      endRow: number
      endCol: number
      value: any
    }> = []

    // Track which cells are part of merged ranges (but not the top-left)
    const mergedCellsSet = new Set<string>()

    // Extract merged cell ranges from ExcelJS
    // ExcelJS stores merged cells differently - we need to iterate through them
    const merges = worksheet.model.merges || []
    merges.forEach((mergeRange: string) => {
      // mergeRange is like "A1:C3"
      const [start, end] = mergeRange.split(":")
      const startCell = worksheet.getCell(start)
      const endCell = worksheet.getCell(end)

      const startRow = Number(startCell.row) - 1 // Convert to 0-indexed
      const startCol = Number(startCell.col) - 1
      const endRow = Number(endCell.row) - 1
      const endCol = Number(endCell.col) - 1

      // Get value from top-left cell
      const value = startCell.value

      mergedCells.push({ startRow, startCol, endRow, endCol, value })

      // Mark all cells in the range (except top-left) as part of merged range
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (r !== startRow || c !== startCol) {
            mergedCellsSet.add(`${r}-${c}`)
          }
        }
      }
    })

    // Get the actual dimensions of the worksheet
    const rowCount = worksheet.rowCount
    const columnCount = worksheet.columnCount

    console.log(`Sheet dimensions: ${rowCount} rows x ${columnCount} columns`)

    // Process all rows
    const rows: (CellData | string | number | boolean | null)[][] = []
    let headers: string[] = []

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const rowIndex = rowNumber - 1 // Convert to 0-indexed
      const processedRow: (CellData | string | number | boolean | null)[] = []

      for (let colIndex = 0; colIndex < columnCount; colIndex++) {
        const colNumber = colIndex + 1 // ExcelJS uses 1-indexed columns
        const cell = row.getCell(colNumber)

        // Skip cells that are part of a merged range (but not the top-left)
        if (mergedCellsSet.has(`${rowIndex}-${colIndex}`)) {
          processedRow.push(null)
          continue
        }

        // Get cell value
        let cellValue: any = cell.value

        // Handle rich text
        if (cellValue && typeof cellValue === "object" && "richText" in cellValue) {
          cellValue = cellValue.richText.map((rt: any) => rt.text).join("")
        }

        // Handle formula results
        if (cellValue && typeof cellValue === "object" && "result" in cellValue) {
          cellValue = cellValue.result
        }

        // Handle hyperlinks
        if (cellValue && typeof cellValue === "object" && "text" in cellValue) {
          cellValue = cellValue.text
        }

        // Extract styling
        const styling: CellStyling = {}
        let hasStyle = false

        // Font styling
        if (cell.font) {
          if (cell.font.bold) {
            styling.bold = true
            hasStyle = true
          }
          if (cell.font.italic) {
            styling.italic = true
            hasStyle = true
          }
          if (cell.font.underline) {
            styling.underline = true
            hasStyle = true
          }
          if (cell.font.size) {
            styling.fontSize = cell.font.size
            hasStyle = true
          }
          if (cell.font.name) {
            styling.fontFamily = cell.font.name
            hasStyle = true
          }

          // Font color
          const fontColor = extractColor(cell.font.color)
          if (fontColor) {
            styling.color = fontColor
            hasStyle = true
          }
        }

        if (cell.fill && cell.fill.type === "pattern") {
          const patternFill = cell.fill as any

          // Only apply background if pattern is not "none"
          if (patternFill.pattern && patternFill.pattern !== "none") {
            // Try fgColor first (foreground color of the pattern)
            let bgColor = extractColor(patternFill.fgColor)

            // If no fgColor, try bgColor
            if (!bgColor && patternFill.bgColor) {
              bgColor = extractColor(patternFill.bgColor)
            }

            // Apply all background colors except pure black (which usually means no color set)
            if (bgColor && bgColor !== "#000000") {
              styling.backgroundColor = bgColor
              hasStyle = true
            }
          }
        }

        // Gradient fills
        if (cell.fill && cell.fill.type === "gradient") {
          const gradientFill = cell.fill as any
          if (gradientFill.stops && gradientFill.stops.length > 0) {
            const firstColor = extractColor(gradientFill.stops[0].color)
            if (firstColor) {
              styling.backgroundColor = firstColor
              hasStyle = true
            }
          }
        }

        // Alignment
        if (cell.alignment) {
          if (cell.alignment.horizontal) {
            styling.alignment = cell.alignment.horizontal as "left" | "center" | "right"
            hasStyle = true
          }
          if (cell.alignment.wrapText) {
            styling.wrapText = true
            hasStyle = true
          }
        }

        // Borders
        if (cell.border) {
          const hasBorder = cell.border.top || cell.border.bottom || cell.border.left || cell.border.right
          if (hasBorder) {
            styling.border = "1px solid #ccc"
            hasStyle = true
          }
        }

        if (cell.note) {
          let commentText = ""
          if (typeof cell.note === "string") {
            commentText = cell.note
          } else if (cell.note.texts && Array.isArray(cell.note.texts)) {
            commentText = cell.note.texts
              .map((t: any) => {
                if (typeof t === "string") return t
                if (t.text) return t.text
                return ""
              })
              .join("")
          }
          if (commentText.trim()) {
            styling.comment = commentText.trim()
            hasStyle = true
          }
        }

        // Check if this is the top-left of a merged cell
        const mergeInfo = mergedCells.find((m) => m.startRow === rowIndex && m.startCol === colIndex)

        if (mergeInfo) {
          styling.merged = true
          styling.mergeRange = [mergeInfo.startRow, mergeInfo.startCol, mergeInfo.endRow, mergeInfo.endCol]
          hasStyle = true
        }

        // Push cell data
        if (hasStyle) {
          processedRow.push({ value: cellValue, styling })
        } else {
          processedRow.push(cellValue)
        }
      }

      rows.push(processedRow)
    })

    // Extract headers from first row
    if (rows.length > 0) {
      headers = rows[0].map((cell: any) => {
        if (cell === null || cell === undefined) return ""
        if (typeof cell === "object" && "value" in cell) return String(cell.value || "")
        return String(cell || "")
      })
    }

    // Remove header row from data rows
    const dataRows = rows.length > 1 ? rows.slice(1) : []

    sheets.push({
      sheetName: worksheet.name,
      headers,
      rows: dataRows,
      totalRows: dataRows.length,
      mergedCells,
    })
  })

  return {
    sheets,
    filename,
    fileSize: blob.size,
  }
}

/**
 * Fetches and parses Excel grading sheet for preview
 */
export async function fetchAndParseGradingSheet(params: GradingSheetParams): Promise<ExcelPreviewData> {
  validateGradingSheetParams(params)
  const { blob, filename } = await fetchGradingExcelSheet(params)
  return await parseExcelForPreview(blob, filename)
}

/**
 * Validates grading sheet parameters
 */
export function validateGradingSheetParams(params: GradingSheetParams): void {
  if (!params.yearId || typeof params.yearId !== "string") {
    throw new Error("Academic Year ID is required. Please select a class from the main page to get valid data.")
  }

  if (!params.groupId || typeof params.groupId !== "string") {
    throw new Error("Group ID is required. Please select a class from the main page to get valid group information.")
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(params.yearId)) {
    console.warn("Year ID does not appear to be a valid UUID format")
  }

  if (!uuidRegex.test(params.groupId)) {
    console.warn("Group ID does not appear to be a valid UUID format")
  }
}

/**
 * Formats file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
