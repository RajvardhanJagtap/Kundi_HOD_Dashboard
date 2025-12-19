import axios from "axios"

// Type definition for group submission
interface GroupSubmission {
  groupId: string
  submissionDate?: string
  status?: string
  [key: string]: any
}

const API_BASE_URL = "http://41.186.186.167:2000/api/v1"

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: false,
  responseType: "json",
})

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        if (typeof window !== "undefined") {
          // Use centralized token refresh utility
          const { refreshAccessToken, clearAuthData } = await import("./token-utils")
          
          const newAccessToken = await refreshAccessToken()
          
          if (newAccessToken) {
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            
            console.log("Token refreshed, retrying original request")
            return apiInstance(originalRequest)
          } else {
            // Refresh failed - clear auth and redirect
            console.error("Token refresh failed, clearing auth data and redirecting to login")
            clearAuthData()
            
            // Dispatch logout event to notify AuthContext
            window.dispatchEvent(new CustomEvent("auth:logout"))
            
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login"
            }
          }
        }
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError)
        if (typeof window !== "undefined") {
          const { clearAuthData } = await import("./token-utils")
          clearAuthData()
          
          // Dispatch logout event to notify AuthContext
          window.dispatchEvent(new CustomEvent("auth:logout"))
          
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login"
          }
        }
      }
    }
    return Promise.reject(error)
  },
)

apiInstance.interceptors.request.use(
  (config: any) => {
    if (typeof window !== "undefined") {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop()?.split(";").shift()
        return null
      }

      const token = getCookie("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

interface SummarySheetResponse {
  success: boolean
  message: string
  data?: {
    downloadUrl?: string
    fileName?: string
    fileSize?: number
  }
  timestamp: string
}

export const generateYearSummarySheet = async (
  academicYearId: string,
  groupId: string,
): Promise<SummarySheetResponse> => {
  if (!groupId || !academicYearId) {
    throw new Error("Academic Year ID and Group ID are required. Please select a class from the main page.")
  }

  // Debug: Check if token exists
  if (typeof window !== "undefined") {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
      return null
    }
    const token = getCookie("accessToken")
    console.log("Summary API - Token check:", {
      hasToken: !!token,
      tokenLength: token?.length,
      cookieValue: document.cookie.includes("accessToken"),
    })
  }

  try {
    const endpoint = `/grading/overall-sheets/generate-year-summary-sheet/${academicYearId}/group/${groupId}/excel`
    console.log("Summary API - Making request to:", endpoint)

    const response = await apiInstance.get(endpoint, {
      responseType: "blob",
    })

    if (response.data instanceof Blob) {
      const downloadBlob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const downloadUrl = window.URL.createObjectURL(downloadBlob)
      const fileName = `year-summary-${academicYearId}-group-${groupId}.xlsx`

      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(downloadUrl)

      return {
        success: true,
        message: "Year summary sheet generated and downloaded successfully",
        data: { fileName, fileSize: response.data.size },
        timestamp: new Date().toISOString(),
      }
    } else {
      throw new Error("Response is not a valid Excel blob")
    }
  } catch (error: any) {
    console.error("Summary API - Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      isAxiosError: error.isAxiosError,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers
      } : null
    })

    // Special handling for 401 errors
    if (error.response?.status === 401) {
      // Check if we're in browser and clear invalid tokens
      if (typeof window !== "undefined") {
        console.log("Summary API - 401 Error, clearing tokens and redirecting to login")
        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        localStorage.removeItem("user")
        localStorage.removeItem("permissions") 
        localStorage.removeItem("roles")
        
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login"
        }
      }
      return {
        success: false,
        message: "Authentication expired. Please log in again.",
        data: undefined,
        timestamp: new Date().toISOString(),
      }
    }

    return {
      success: false,
      message: `Failed to generate year summary sheet: ${error instanceof Error ? error.message : "Unknown error"}`,
      data: undefined,
      timestamp: new Date().toISOString(),
    }
  }
}

export const getAvailableGroups = async (academicYearId: string) => {
  const url = `/grading/groups?academicYearId=${academicYearId}`
  const response = await apiInstance.get(url)
  return response.data
}

export const getSubmittedGroupIds = async (): Promise<string[]> => {
  return []
}

export const getSubmittedGroups = async (): Promise<GroupSubmission[]> => {
  return []
}

export interface SummarySheetParams {
  academicYearId: string
  groupId: string
}

export const generateSummarySheet = async (academicYearId: string, groupId: string): Promise<SummarySheetResponse> => {
  return generateYearSummarySheet(academicYearId, groupId)
}

export const generateSummarySheetForPreview = async (
  academicYearId: string,
  groupId: string,
): Promise<{ blob: Blob; filename: string }> => {
  if (!groupId || !academicYearId) {
    throw new Error("Academic Year ID and Group ID are required for summary sheet generation.")
  }

  const endpoint = `/grading/overall-sheets/generate-year-summary-sheet/${academicYearId}/group/${groupId}/excel`

  const response = await apiInstance.get(endpoint, {
    responseType: "blob",
  })

  const filename = `year-summary-${academicYearId}-group-${groupId}.xlsx`

  return { blob: response.data, filename }
}

export type { SummarySheetResponse }

function argbToHex(argb: string | undefined): string | undefined {
  if (!argb) return undefined
  const hex = argb.length === 8 ? argb.substring(2) : argb
  return `#${hex}`
}

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
 * Parses Excel blob data using ExcelJS for proper styling and comments
 */
export async function parseExcelForPreview(blob: Blob, filename: string): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("Excel parsing is only available in the browser")
  }

  const ExcelJS = await import("exceljs")

  const arrayBuffer = await blob.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  const sheets: any[] = []

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
          let bgColor = extractColor(patternFill.fgColor)
          if (!bgColor && patternFill.bgColor) {
            bgColor = extractColor(patternFill.bgColor)
          }
          if (bgColor) {
            styling.backgroundColor = bgColor
            hasStyle = true
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

        // Extract comments
        if (cell.note) {
          let commentText = ""
          if (typeof cell.note === "string") {
            commentText = cell.note
          } else if ((cell.note as any).texts) {
            commentText = (cell.note as any).texts.map((t: any) => t.text || t).join("")
          }
          if (commentText) {
            styling.comment = commentText
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

export async function fetchAndParseSummarySheet(academicYearId: string, groupId: string): Promise<any> {
  const { blob, filename } = await generateSummarySheetForPreview(academicYearId, groupId)
  const previewData = await parseExcelForPreview(blob, filename)
  return previewData
}
