// src/lib/api-retakers.ts
// Dedicated API utility for managing retakers and repeaters data and Excel file operations

/**
 * Parameters for retakers/repeaters sheet generation
 */
export interface RetakersSheetParams {
  yearId: string
  groupId: string
}

/**
 * Retakers sheet response interface
 */
interface RetakersSheetResponse {
  blob: Blob
  filename: string
}

/**
 * Excel sheet data structure for retakers
 */
export interface RetakersExcelSheetData {
  sheetName: string
  headers: string[]
  rows: (string | number | boolean | null | { value: any; styling?: any })[][]
  totalRows: number
  mergedCells?: Array<{
    startRow: number
    startCol: number
    endRow: number
    endCol: number
    value: any
  }>
}

/**
 * Preview data structure for retakers Excel
 */
export interface RetakersExcelPreviewData {
  sheets: RetakersExcelSheetData[]
  filename: string
  fileSize: number
}

/**
 * Student retaker information
 */
export interface RetakerStudent {
  id: string
  name: string
  regNumber: string
  previousGrade: string
  currentStatus: "Retaking" | "Repeating"
  reason: string
  year: number
  semester: string
  courses: string[]
}

/**
 * Retakers summary statistics
 */
export interface RetakersSummary {
  totalStudents: number
  byYear: Record<string, number>
  byStatus: Record<string, number>
  byGrade: Record<string, number>
  passRate: number
}

/**
 * Convert ARGB hex color to standard hex color
 */
function argbToHex(argb: string | undefined): string | undefined {
  if (!argb) return undefined
  const hex = argb.length === 8 ? argb.substring(2) : argb
  return `#${hex}`
}

/**
 * Extract color from ExcelJS color object
 */
function extractColor(color: any): string | undefined {
  if (!color) return undefined

  if (color.argb) {
    return argbToHex(color.argb)
  }

  if (color.theme !== undefined) {
    const themeColors: { [key: number]: string } = {
      0: "#000000",
      1: "#FFFFFF",
      2: "#1F497D",
      3: "#EEECE1",
      4: "#4F81BD",
      5: "#C0504D",
      6: "#9BBB59",
      7: "#8064A2",
      8: "#4BACC6",
      9: "#F79646",
    }

    let baseColor = themeColors[color.theme] || "#000000"

    if (color.tint !== undefined && color.tint !== 0) {
      baseColor = applyTintToColor(baseColor, color.tint)
    }

    return baseColor
  }

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
      64: "#000000",
      65: "#FFFFFF",
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

  const toHex = (value: number) => value.toString(16).padStart(2, "0")
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
}

/**
 * Fetches the retakers/repeaters Excel sheet from the API
 */
export async function fetchRetakersExcelSheet(params: RetakersSheetParams): Promise<RetakersSheetResponse> {
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

  const endpoint = `http://41.186.186.167:2000/api/v1/grading/overall-sheets/generate-year-retake-sheet/${params.yearId}/group/${params.groupId}/excel`

  console.log("Fetching retakers sheet from:", endpoint)

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`

    try {
      const errorData = await response.json()
      if (errorData.message) errorMessage = errorData.message
      else if (errorData.error) errorMessage = errorData.error
    } catch {}

    throw new Error(`Failed to fetch retakers sheet: ${errorMessage}`)
  }

  const blob = await response.blob()

  const shortYearId = params.yearId.slice(0, 8)
  const shortGroupId = params.groupId.slice(0, 8)
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `retakers-sheet-${shortYearId}-${shortGroupId}-${timestamp}.xlsx`

  return { blob, filename }
}

/**
 * Downloads the retakers/repeaters Excel sheet directly
 */
export async function downloadRetakersExcelSheet(params: RetakersSheetParams): Promise<string> {
  try {
    console.log("Starting retakers sheet download with params:", params)

    const { blob, filename } = await fetchRetakersExcelSheet(params)

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    console.log("Retakers sheet download initiated:", filename)
    return filename
  } catch (error) {
    console.error("Error downloading retakers sheet:", error)
    throw error
  }
}

/**
 * Parse Excel blob for preview using ExcelJS
 */
async function parseRetakersExcelForPreview(blob: Blob, filename: string): Promise<RetakersExcelPreviewData> {
  if (typeof window === "undefined") {
    throw new Error("Excel parsing is only available in the browser")
  }

  const ExcelJS = await import("exceljs")

  const arrayBuffer = await blob.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  const sheets: RetakersExcelSheetData[] = []

  workbook.eachSheet((worksheet) => {
    const mergedCells: Array<{
      startRow: number
      startCol: number
      endRow: number
      endCol: number
      value: any
    }> = []

    const mergedCellsSet = new Set<string>()

    const merges = (worksheet.model as any).merges || []
    merges.forEach((mergeRange: string) => {
      const [start, end] = mergeRange.split(":")
      const startCell = worksheet.getCell(start)
      const endCell = worksheet.getCell(end)

      const startRow = Number(startCell.row) - 1
      const startCol = Number(startCell.col) - 1
      const endRow = Number(endCell.row) - 1
      const endCol = Number(endCell.col) - 1

      const value = startCell.value

      mergedCells.push({ startRow, startCol, endRow, endCol, value })

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (r !== startRow || c !== startCol) {
            mergedCellsSet.add(`${r}-${c}`)
          }
        }
      }
    })

    const columnCount = worksheet.columnCount
    const rows: any[] = []
    let headers: string[] = []

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const rowIndex = rowNumber - 1
      const processedRow: any[] = []

      for (let colIndex = 0; colIndex < columnCount; colIndex++) {
        const colNumber = colIndex + 1
        const cell = row.getCell(colNumber)

        if (mergedCellsSet.has(`${rowIndex}-${colIndex}`)) {
          processedRow.push(null)
          continue
        }

        let cellValue: any = cell.value

        if (cellValue && typeof cellValue === "object" && "richText" in cellValue) {
          cellValue = cellValue.richText.map((rt: any) => rt.text).join("")
        }
        if (cellValue && typeof cellValue === "object" && "result" in cellValue) {
          cellValue = cellValue.result
        }
        if (cellValue && typeof cellValue === "object" && "text" in cellValue) {
          cellValue = cellValue.text
        }

        const styling: any = {}
        let hasStyle = false

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

          const fontColor = extractColor(cell.font.color)
          if (fontColor && fontColor !== "#000000") {
            styling.color = fontColor
            hasStyle = true
          }
        }

        if (cell.fill && (cell.fill as any).type === "pattern") {
          const patternFill = cell.fill as any
          if (patternFill.pattern && patternFill.pattern !== "none") {
            let bgColor = extractColor(patternFill.fgColor)
            if (!bgColor && patternFill.bgColor) {
              bgColor = extractColor(patternFill.bgColor)
            }
            if (bgColor && bgColor !== "#000000") {
              styling.backgroundColor = bgColor
              hasStyle = true
            }
          }
        }

        if (cell.alignment) {
          if (cell.alignment.horizontal) {
            styling.alignment = cell.alignment.horizontal
            hasStyle = true
          }
          if (cell.alignment.wrapText) {
            styling.wrapText = true
            hasStyle = true
          }
        }

        if (cell.note) {
          let commentText = ""
          if (typeof cell.note === "string") {
            commentText = cell.note
          } else if ((cell.note as any).texts && Array.isArray((cell.note as any).texts)) {
            commentText = (cell.note as any).texts
              .map((t: any) => {
                if (typeof t === "string") return t
                if (t.text) return t.text
                return ""
              })
              .join("")
          } else if ((cell.note as any).text) {
            commentText = (cell.note as any).text
          }
          if (commentText.trim()) {
            styling.comment = commentText.trim()
            hasStyle = true
          }
        }

        const mergeInfo = mergedCells.find((m) => m.startRow === rowIndex && m.startCol === colIndex)

        if (mergeInfo) {
          styling.merged = true
          styling.mergeRange = [mergeInfo.startRow, mergeInfo.startCol, mergeInfo.endRow, mergeInfo.endCol]
          hasStyle = true
        }

        if (hasStyle) {
          processedRow.push({ value: cellValue, styling })
        } else {
          processedRow.push(cellValue)
        }
      }

      rows.push(processedRow)
    })

    if (rows.length > 0) {
      headers = rows[0].map((cell: any) => {
        if (cell === null || cell === undefined) return ""
        if (typeof cell === "object" && "value" in cell) return String(cell.value || "")
        return String(cell || "")
      })
    }

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
 * Fetches and parses the retakers/repeaters Excel sheet for preview
 */
export async function fetchAndParseRetakersSheet(params: RetakersSheetParams): Promise<RetakersExcelPreviewData> {
  try {
    console.log("Fetching and parsing retakers sheet with params:", params)

    const { blob, filename } = await fetchRetakersExcelSheet(params)
    const previewData = await parseRetakersExcelForPreview(blob, filename)

    console.log("Retakers sheet parsed successfully:", previewData)
    return previewData
  } catch (error) {
    console.error("Error fetching and parsing retakers sheet:", error)
    throw error
  }
}

/**
 * Validates retakers sheet parameters
 */
export function validateRetakersSheetParams(params: RetakersSheetParams): void {
  if (!params.yearId || typeof params.yearId !== "string") {
    throw new Error("Year ID is required and must be a string")
  }

  if (!params.groupId || typeof params.groupId !== "string") {
    throw new Error("Group ID is required and must be a string")
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(params.yearId)) {
    throw new Error("Year ID must be a valid UUID format")
  }

  if (!uuidRegex.test(params.groupId)) {
    throw new Error("Group ID must be a valid UUID format")
  }
}

/**
 * Utility function to format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
