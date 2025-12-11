"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchModuleMarkSheetExcel } from "@/lib/module-marks/grading-api"
import ExcelJS from "exceljs"

export interface CellStyling {
  backgroundColor?: string
  color?: string
  fontWeight?: string
  fontStyle?: string
  textAlign?: string
  borderTop?: string
  borderRight?: string
  borderBottom?: string
  borderLeft?: string
  comment?: string
}

export interface CellData {
  value: any
  styling: CellStyling
  rowSpan?: number
  colSpan?: number
  isMergedChild?: boolean
}

interface MergeRange {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
}

// Helper to convert ARGB to hex color
function argbToHex(argb: string | undefined): string | undefined {
  if (!argb) return undefined
  if (argb.length === 8) {
    return `#${argb.substring(2)}`
  } else if (argb.length === 6) {
    return `#${argb}`
  }
  return undefined
}

// Helper to extract cell styling from ExcelJS cell
function extractCellStyling(cell: ExcelJS.Cell): CellStyling {
  const styling: CellStyling = {}

  // Extract background color
  if (cell.fill && cell.fill.type === "pattern") {
    const patternFill = cell.fill as ExcelJS.FillPattern
    if (patternFill.pattern !== "none") {
      const fgColor = patternFill.fgColor
      if (fgColor) {
        if (fgColor.argb) {
          const hex = argbToHex(fgColor.argb)
          if (hex && hex !== "#000000" && hex !== "#FFFFFF") {
            styling.backgroundColor = hex
          }
        } else if (fgColor.theme !== undefined) {
          const themeColors: Record<number, string> = {
            0: "#FFFFFF",
            1: "#000000",
            2: "#E7E6E6",
            3: "#44546A",
            4: "#4472C4",
            5: "#ED7D31",
            6: "#A5A5A5",
            7: "#FFC000",
            8: "#5B9BD5",
            9: "#70AD47",
          }
          const color = themeColors[fgColor.theme]
          if (color && color !== "#000000" && color !== "#FFFFFF") {
            styling.backgroundColor = color
          }
        }
      }
    }
  }

  // Extract font color
  if (cell.font?.color) {
    if (cell.font.color.argb) {
      const hex = argbToHex(cell.font.color.argb)
      if (hex) {
        styling.color = hex
      }
    } else if (cell.font.color.theme !== undefined) {
      const themeColors: Record<number, string> = {
        0: "#FFFFFF",
        1: "#000000",
        2: "#E7E6E6",
        3: "#44546A",
        4: "#4472C4",
        5: "#ED7D31",
        6: "#A5A5A5",
        7: "#FFC000",
        8: "#5B9BD5",
        9: "#70AD47",
      }
      styling.color = themeColors[cell.font.color.theme] || "#000000"
    }
  }

  if (cell.font?.bold) {
    styling.fontWeight = "bold"
  }

  if (cell.font?.italic) {
    styling.fontStyle = "italic"
  }

  if (cell.alignment?.horizontal) {
    styling.textAlign = cell.alignment.horizontal as string
  }

  if (cell.note) {
    if (typeof cell.note === "string") {
      styling.comment = cell.note
    } else if (cell.note.texts) {
      styling.comment = cell.note.texts.map((t: any) => t.text || "").join("")
    } else if ((cell.note as any).text) {
      styling.comment = (cell.note as any).text
    }
  }

  return styling
}

function parseMergeRanges(worksheet: ExcelJS.Worksheet): MergeRange[] {
  const merges: MergeRange[] = []
  const processedAddresses = new Set<string>()

  // Method 1: Try worksheet.model.merges (official API)
  const modelMerges = (worksheet as any).model?.merges
  if (Array.isArray(modelMerges)) {
    for (const mergeAddress of modelMerges) {
      if (processedAddresses.has(mergeAddress)) continue
      processedAddresses.add(mergeAddress)
      const parsed = parseMergeAddress(mergeAddress)
      if (parsed) merges.push(parsed)
    }
  }

  // Method 2: Try worksheet._merges (internal property)
  const internalMerges = (worksheet as any)._merges
  if (internalMerges && typeof internalMerges === "object") {
    for (const mergeAddress of Object.keys(internalMerges)) {
      if (processedAddresses.has(mergeAddress)) continue
      processedAddresses.add(mergeAddress)
      const parsed = parseMergeAddress(mergeAddress)
      if (parsed) merges.push(parsed)
    }
  }

  // Method 3: Check each cell for isMerged property
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      if ((cell as any).isMerged && (cell as any).master) {
        const master = (cell as any).master
        const masterAddr = master.address || master._address
        const cellAddr = cell.address || (cell as any)._address

        if (masterAddr && cellAddr && masterAddr !== cellAddr) {
          // This cell is part of a merge - we need the full range
          const mergeKey = `merge-${masterAddr}`
          if (!processedAddresses.has(mergeKey)) {
            // Try to find the extent of the merge by examining the master cell's model
            const masterCell = worksheet.getCell(masterAddr)
            const model = (masterCell as any).model || (masterCell as any)._value?.model
            if (model?.master) {
              // Already handled
            }
          }
        }
      }
    })
  })

  console.log("[v0] Parsed merges:", merges)
  return merges
}

function parseMergeAddress(mergeAddress: string): MergeRange | null {
  // Parse addresses like "A1:C3" or "B2:B5"
  const match = mergeAddress.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/i)
  if (match) {
    const startCol = columnToNumber(match[1].toUpperCase())
    const startRow = Number.parseInt(match[2], 10)
    const endCol = columnToNumber(match[3].toUpperCase())
    const endRow = Number.parseInt(match[4], 10)
    return { startRow, startCol, endRow, endCol }
  }
  return null
}

function columnToNumber(col: string): number {
  let num = 0
  for (let i = 0; i < col.length; i++) {
    num = num * 26 + (col.charCodeAt(i) - 64)
  }
  return num
}

function getMergeInfo(
  rowNum: number,
  colNum: number,
  merges: MergeRange[],
): { rowSpan?: number; colSpan?: number; isMergedChild?: boolean } {
  for (const merge of merges) {
    if (rowNum === merge.startRow && colNum === merge.startCol) {
      return {
        rowSpan: merge.endRow - merge.startRow + 1,
        colSpan: merge.endCol - merge.startCol + 1,
      }
    }

    if (rowNum >= merge.startRow && rowNum <= merge.endRow && colNum >= merge.startCol && colNum <= merge.endCol) {
      return { isMergedChild: true }
    }
  }

  return {}
}

export function useMarkSheet(moduleId: string | null) {
  const [marksheetData, setMarksheetData] = useState<any[][]>([])
  const [styledData, setStyledData] = useState<CellData[][]>([])
  const [columnWidths, setColumnWidths] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [excelBlob, setExcelBlob] = useState<Blob | null>(null)

  const fetchMarksheet = useCallback(async () => {
    if (!moduleId) {
      setMarksheetData([])
      setStyledData([])
      setColumnWidths([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const blob = await fetchModuleMarkSheetExcel(moduleId)
      setExcelBlob(blob)

      const arrayBuffer = await blob.arrayBuffer()
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(arrayBuffer)

      const worksheet = workbook.worksheets[0]
      if (!worksheet) {
        throw new Error("No worksheet found in the Excel file")
      }

      const merges = parseMergeRanges(worksheet)

      // Extract column widths from Excel
      const widths: number[] = []
      let maxCol = 0
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        if (row.cellCount > maxCol) {
          maxCol = row.cellCount
        }
        // Also check the actual column count
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (colNumber > maxCol) maxCol = colNumber
        })
      })
      const columnCount = Math.max(maxCol, worksheet.columnCount || 20)
      
      // Get column widths from Excel (default to 15 if not set)
      for (let col = 1; col <= columnCount; col++) {
        const column = worksheet.getColumn(col)
        // Excel column width is in characters, convert to pixels (approx 7 pixels per character)
        const width = column.width ? Math.max(column.width * 7, 50) : 80
        widths.push(width)
      }
      setColumnWidths(widths)

      const rawData: any[][] = []
      const styled: CellData[][] = []

      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const rowData: any[] = []
        const rowStyled: CellData[] = []

        for (let colNumber = 1; colNumber <= columnCount; colNumber++) {
          const cell = row.getCell(colNumber)

          let value = null
          if (cell.value !== null && cell.value !== undefined) {
            if (cell.type === ExcelJS.ValueType.Formula) {
              value = (cell.value as ExcelJS.CellFormulaValue).result
            } else if (typeof cell.value === "object" && (cell.value as any).richText) {
              // Handle rich text
              value = (cell.value as any).richText.map((rt: any) => rt.text || "").join("")
            } else {
              value = cell.value
            }
          }

          const styling = extractCellStyling(cell)
          const mergeInfo = getMergeInfo(rowNumber, colNumber, merges)

          rowData.push(value)
          rowStyled.push({
            value,
            styling,
            ...mergeInfo,
          })
        }

        rawData.push(rowData)
        styled.push(rowStyled)
      })

      setMarksheetData(rawData)
      setStyledData(styled)
    } catch (err) {
      console.error("Error fetching marksheet:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setMarksheetData([])
      setStyledData([])
    } finally {
      setIsLoading(false)
    }
  }, [moduleId])

  useEffect(() => {
    fetchMarksheet()
  }, [fetchMarksheet])

  return {
    marksheetData,
    styledData,
    columnWidths,
    isLoading,
    error,
    excelBlob,
    refetch: fetchMarksheet,
  }
}
