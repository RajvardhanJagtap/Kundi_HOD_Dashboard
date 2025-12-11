"use client"

import React, { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Maximize2, Minimize2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ExcelSheetData } from "@/lib/api-grading"

interface ExcelPreviewTableProps {
  data: ExcelSheetData[]
  onDownload?: () => void
  isDownloadLoading?: boolean
  hideTopMeta?: boolean
  startAtHeader?: boolean
}

export function ExcelPreviewTable({
  data,
  onDownload,
  isDownloadLoading = false,
  hideTopMeta = false,
  startAtHeader = false,
}: ExcelPreviewTableProps) {
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const visibleRows = data[currentSheetIndex]?.rows || []
  const currentSheet = data[currentSheetIndex]

  const topMetaCutIndex = React.useMemo(() => {
    if (!hideTopMeta || !visibleRows || visibleRows.length === 0) return -1

    const yearRegex = /\bYEAR\s*(?:I{1,3}|IV|V|\d+)\b/i

    if (startAtHeader) {
      const headerIndicators = [
        "SN",
        "S/N",
        "SERIAL",
        "NO",
        "REF",
        "REF.NO",
        "REF NO",
        "REFERENCE",
        "SEX",
        "GENDER",
        "MATRIC",
        "MATRIC NO",
        "NAME",
        "STUDENT NAME",
        "FULL NAME",
        "MODULE",
        "MODULE CODE",
        "MODULE TITLE",
        "COURSE",
        "TOTAL",
        "MARK",
        "SCORE",
        "GRADE",
        "G",
        "F",
        "M",
        "TOT",
        "%F",
        "%M",
        "PERCENT",
        "GPA",
        "POINT",
        "CREDIT",
        "UNIT",
      ]

      for (let i = 0; i < visibleRows.length; i++) {
        const row = visibleRows[i]
        const rowText = row
          .map((c: any) => {
            if (c === null || c === undefined) return ""
            if (typeof c === "object" && "value" in c) return String(c.value || "")
            return String(c)
          })
          .join(" ")
          .toUpperCase()
          .replace(/\s+/g, " ")

        let matchCount = 0
        for (const h of headerIndicators) {
          if (rowText.includes(h.toUpperCase())) matchCount++
        }

        if (matchCount >= 3) return i
      }
      return -1
    }

    let lastYearMatch = -1
    for (let i = 0; i < visibleRows.length; i++) {
      const row = visibleRows[i]
      const rowText = row
        .map((c: any) => {
          if (c === null || c === undefined) return ""
          if (typeof c === "object" && "value" in c) return String(c.value || "")
          return String(c)
        })
        .join(" ")
        .toUpperCase()

      if (yearRegex.test(rowText)) {
        lastYearMatch = i
        continue
      }

      if (
        rowText.includes("SN") &&
        (rowText.includes("REF") ||
          rowText.includes("REF.NO") ||
          rowText.includes("REF NO") ||
          rowText.includes("SEX") ||
          rowText.includes("MATRIC"))
      ) {
        return i
      }
    }

    if (lastYearMatch >= 0) {
      return lastYearMatch + 1
    }

    return -1
  }, [hideTopMeta, startAtHeader, visibleRows])

  const headerRowInfo = React.useMemo(() => {
    const headerRowMap = new Map<number, "main" | "semester" | "modules">()

    if (!hideTopMeta || !visibleRows || visibleRows.length === 0) {
      return headerRowMap
    }

    const startIndex = topMetaCutIndex >= 0 ? topMetaCutIndex : 0

    for (let i = startIndex; i < visibleRows.length; i++) {
      const row = visibleRows[i]
      const rowText = row
        .map((c: any) => {
          if (c === null || c === undefined) return ""
          if (typeof c === "object" && "value" in c) return String(c.value || "")
          return String(c)
        })
        .join(" ")
        .toUpperCase()

      if (
        rowText.includes("SN") &&
        (rowText.includes("REF") || rowText.includes("SEX") || rowText.includes("MATRIC"))
      ) {
        headerRowMap.set(i, "main")
      } else if (
        (rowText.includes("MODULE") && rowText.includes("CODE")) ||
        (rowText.includes("MODULE") && rowText.includes("TITLE"))
      ) {
        headerRowMap.set(i, "modules")
      } else if (
        rowText.includes("SEMESTER") ||
        rowText.includes("OBSERVATION") ||
        (rowText.includes("TOTAL") && rowText.includes("CREDIT")) ||
        rowText.includes("REMARK") ||
        rowText.includes("ANNUAL")
      ) {
        headerRowMap.set(i, "semester")
      }
    }

    return headerRowMap
  }, [topMetaCutIndex, hideTopMeta, visibleRows])

  const mergedCellsLookup = React.useMemo(() => {
    const lookup = new Map<string, { startRow: number; startCol: number; endRow: number; endCol: number; value: any }>()

    if (currentSheet?.mergedCells) {
      currentSheet.mergedCells.forEach((merge) => {
        for (let row = merge.startRow; row <= merge.endRow; row++) {
          for (let col = merge.startCol; col <= merge.endCol; col++) {
            lookup.set(`${row}-${col}`, merge)
          }
        }
      })
    }

    return lookup
  }, [currentSheet?.mergedCells])

  if (!currentSheet) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No data available to preview</p>
        </CardContent>
      </Card>
    )
  }

  const renderCellContent = (
    cellValue: any,
    styling: any,
    rowSpan: number | undefined,
    colSpan: number | undefined,
  ) => {
    const textColor = styling?.color || "inherit"
    const isMergedCell = (rowSpan && rowSpan > 1) || (colSpan && colSpan > 1)

    let content: React.ReactNode

    if (cellValue === null || cellValue === undefined || cellValue === "") {
      content = <span className="text-transparent select-none">-</span>
    } else if (typeof cellValue === "number") {
      content = (
        <span className={isMergedCell ? "font-mono text-center" : "text-right font-mono"} style={{ color: textColor }}>
          {cellValue.toLocaleString()}
        </span>
      )
    } else if (typeof cellValue === "boolean") {
      content = (
        <span className="text-center font-medium" style={{ color: textColor }}>
          {cellValue ? "TRUE" : "FALSE"}
        </span>
      )
    } else {
      const stringValue = String(cellValue).trim()
      if (stringValue === "") {
        content = <span className="text-transparent select-none">-</span>
      } else {
        content = <span style={{ color: textColor }}>{stringValue}</span>
      }
    }

    // If there's a comment, wrap in tooltip with red triangle indicator
    if (styling?.comment) {
      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative cursor-help w-full h-full">
                {content}
                {/* Red triangle indicator in top-right corner */}
                <div
                  className="absolute top-0 right-0 w-0 h-0 pointer-events-none"
                  style={{
                    borderLeft: "8px solid transparent",
                    borderTop: "8px solid #dc2626",
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="start"
              className="max-w-sm bg-[#ffffc0] border border-[#000000] text-black p-2 text-xs shadow-lg z-[9999]"
              sideOffset={5}
            >
              <div className="whitespace-pre-wrap break-words">{styling.comment}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return content
  }

  return (
    <>
      <style jsx>{`
        .excel-preview-container {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }
        .excel-table-scroll {
          width: 100%;
          overflow-x: auto;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #026892 #e5e7eb;
        }
        .excel-table-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .excel-table-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .excel-table-scroll::-webkit-scrollbar-thumb {
          background: #026892;
          border-radius: 4px;
        }
        .excel-table-scroll::-webkit-scrollbar-thumb:hover {
          background: #025f7f;
        }
        .excel-preview-table-auto-width {
          min-width: max-content;
          width: max-content;
        }
      `}</style>

      <div
        className={`excel-preview-container ${isExpanded ? "fixed inset-4 z-50 bg-white shadow-2xl rounded-lg" : ""}`}
      >
        <Card className="h-full overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-3 bg-gray-50 border-b">
            <div className="flex items-center gap-2">
              {onDownload && (
                <Button
                  size="sm"
                  onClick={onDownload}
                  disabled={isDownloadLoading}
                  className="bg-[#026892] hover:bg-[#025f7f] text-white"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {isDownloadLoading ? "Downloading..." : "Download"}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="border-gray-300"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-hidden">
            {/* Sheet Tabs */}
            {data.length > 1 && (
              <div className="border-b bg-gray-50 px-4 py-2">
                <div className="flex gap-1 overflow-x-auto">
                  {data.map((sheet, index) => (
                    <Button
                      key={index}
                      variant={index === currentSheetIndex ? "default" : "ghost"}
                      size="sm"
                      className={`flex-shrink-0 text-xs font-medium px-3 py-1 ${
                        index === currentSheetIndex
                          ? "bg-[#026892] text-white hover:bg-[#025f7f]"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                      onClick={() => setCurrentSheetIndex(index)}
                    >
                      {sheet.sheetName}
                      <Badge
                        variant="secondary"
                        className={`ml-2 text-xs ${
                          index === currentSheetIndex
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {sheet.totalRows}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Table Container with Scroll */}
            <div className={`excel-table-scroll ${isExpanded ? "h-[calc(100vh-200px)]" : "h-96"}`}>
              <Table className="border-collapse excel-preview-table-auto-width text-sm">
                <TableBody>
                  {visibleRows.map((row, rowIndex) => {
                    const actualRowIndex = rowIndex

                    if (topMetaCutIndex >= 0 && actualRowIndex < topMetaCutIndex) {
                      return null
                    }

                    return (
                      <TableRow
                        key={actualRowIndex}
                        className={`border-b border-gray-200 ${
                          headerRowInfo.has(actualRowIndex)
                            ? headerRowInfo.get(actualRowIndex) === "main"
                              ? "bg-green-100 hover:bg-green-100"
                              : ""
                            : actualRowIndex % 2 === 1
                              ? "bg-gray-50/50 hover:bg-blue-50/50"
                              : "bg-white hover:bg-blue-50/50"
                        }`}
                      >
                        {row.map((cell, cellIndex) => {
                          const mergeInfo = mergedCellsLookup.get(`${actualRowIndex + 1}-${cellIndex}`)
                          const isTopLeftOfMerge =
                            mergeInfo && actualRowIndex + 1 === mergeInfo.startRow && cellIndex === mergeInfo.startCol

                          if (mergeInfo && !isTopLeftOfMerge) {
                            return null
                          }

                          const cellValue = cell && typeof cell === "object" && "value" in cell ? cell.value : cell
                          const styling = cell && typeof cell === "object" && "styling" in cell ? cell.styling : null

                          const rowText = visibleRows[actualRowIndex]
                            .map((c: any) => {
                              if (c === null || c === undefined) return ""
                              if (typeof c === "object" && "value" in c) return String(c.value || "")
                              return String(c)
                            })
                            .join(" ")
                            .toLowerCase()

                          const hasHeaderKeywords =
                            rowText.includes("sn") ||
                            rowText.includes("sl.no") ||
                            rowText.includes("sl no") ||
                            rowText.includes("reg") ||
                            rowText.includes("candidate") ||
                            rowText.includes("gender") ||
                            rowText.includes("final assessment") ||
                            rowText.includes("test") ||
                            rowText.includes("assignment") ||
                            rowText.includes("examinati") ||
                            rowText.includes("total exam") ||
                            rowText.includes("cat mark") ||
                            rowText.includes("final mark") ||
                            rowText.includes("grade") ||
                            rowText.includes("remark") ||
                            rowText.includes("attendance") ||
                            (rowText.includes("i") && rowText.includes("e")) ||
                            rowText.includes("name") ||
                            rowText.includes("module") ||
                            rowText.includes("code") ||
                            rowText.includes("title") ||
                            rowText.includes("total") ||
                            rowText.includes("mark") ||
                            rowText.includes("score") ||
                            rowText.includes("gpa") ||
                            rowText.includes("credit")

                          const hasStudentData = visibleRows[actualRowIndex].some((cell: any) => {
                            const val = String(
                              cell && typeof cell === "object" && "value" in cell ? cell.value || "" : cell || "",
                            )
                            return (
                              /^\d{6,}$/.test(val.trim()) ||
                              (/^\d+\.?\d*$/.test(val.trim()) &&
                                Number.parseFloat(val) > 0 &&
                                Number.parseFloat(val) <= 100)
                            )
                          })

                          const isHeaderRow =
                            actualRowIndex === 0 ||
                            (actualRowIndex < 3 &&
                              hasHeaderKeywords &&
                              !hasStudentData &&
                              !rowText.includes("summary statistics") &&
                              !rowText.includes("performance summary") &&
                              !rowText.includes("total students") &&
                              !rowText.includes("students passed") &&
                              !rowText.includes("average score"))

                          const cellStyle: React.CSSProperties = {
                            whiteSpace: styling?.wrapText ? "pre-wrap" : "nowrap",
                            minWidth: "40px",
                            maxWidth: "160px",
                            padding: "6px 8px",
                            verticalAlign: "middle",
                            fontSize: "12px",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            borderTop: "1.5px solid",
                            borderRight: "1.5px solid",
                            borderBottom: "1.5px solid",
                            borderLeft: "1.5px solid",
                            borderColor: isHeaderRow ? "#9ca3af" : "#d1d5db",
                          }

                          const cellClasses = ["text-xs", "relative"]

                          let rowSpan: number | undefined = undefined
                          let colSpan: number | undefined = undefined

                          if (styling) {
                            if (styling.bold) cellClasses.push("font-bold")
                            if (styling.italic) cellClasses.push("italic")
                            if (styling.underline) cellClasses.push("underline")

                            // Apply background color from Excel
                            if (styling.backgroundColor) {
                              cellStyle.backgroundColor = styling.backgroundColor
                            }
                            // Apply font color from Excel
                            if (styling.color) {
                              cellStyle.color = styling.color
                            }

                            if (styling.fontSize) cellStyle.fontSize = `${Math.min(styling.fontSize, 14)}px`
                            if (styling.fontFamily) cellStyle.fontFamily = styling.fontFamily

                            if (styling.alignment) {
                              if (styling.alignment === "center") cellClasses.push("text-center")
                              else if (styling.alignment === "right") cellClasses.push("text-right")
                              else if (styling.alignment === "left") cellClasses.push("text-left")
                            }

                            if (styling.border) {
                              cellStyle.border = styling.border
                            }

                            if (styling.merged && styling.mergeRange) {
                              const [startRow, startCol, endRow, endCol] = styling.mergeRange
                              const calculatedRowSpan = endRow - startRow + 1
                              const calculatedColSpan = endCol - startCol + 1

                              if (calculatedRowSpan > 1) rowSpan = calculatedRowSpan
                              if (calculatedColSpan > 1) colSpan = calculatedColSpan

                              if ((rowSpan && rowSpan > 1) || (colSpan && colSpan > 1)) {
                                cellClasses.push("text-center")
                                cellStyle.textAlign = "center"
                                cellStyle.verticalAlign = "middle"
                              }
                            }
                          }

                          // Fallback header styling (only if no backgroundColor from Excel)
                          if (!styling?.backgroundColor && headerRowInfo.has(actualRowIndex)) {
                            const headerType = headerRowInfo.get(actualRowIndex)
                            const cellValueStr = String(cellValue || "")
                              .toUpperCase()
                              .trim()

                            const isHeaderCell =
                              cellValueStr !== "" &&
                              (cellValueStr.includes("SEMESTER") ||
                                cellValueStr.includes("MODULE") ||
                                cellValueStr.includes("CODE") ||
                                cellValueStr.includes("TITLE") ||
                                cellValueStr.includes("TOTAL") ||
                                cellValueStr.includes("CREDIT") ||
                                cellValueStr.includes("ANNUAL") ||
                                cellValueStr.includes("PREVIOUS") ||
                                cellValueStr.includes("CURRENT") ||
                                cellValueStr.includes("FAILED") ||
                                cellValueStr === "REMARK" ||
                                cellValueStr === "PRH" ||
                                cellValueStr === "SN" ||
                                cellValueStr.includes("REF") ||
                                cellValueStr === "SEX" ||
                                cellValueStr.includes("OBSERVATION"))

                            if (isHeaderCell) {
                              if (headerType === "main" || headerType === "modules") {
                                cellStyle.backgroundColor = "#c8e6c9"
                              } else if (headerType === "semester") {
                                cellStyle.backgroundColor = "#d1c4e9"
                              }
                            }

                            if (
                              cellValueStr.includes("TOTAL") ||
                              cellValueStr.includes("CREDIT") ||
                              cellValueStr.includes("ANNUAL") ||
                              cellValueStr.includes("PREVIOUS") ||
                              cellValueStr.includes("CURRENT") ||
                              cellValueStr.includes("FAILED") ||
                              cellValueStr === "REMARK" ||
                              cellValueStr === "PRH"
                            ) {
                              cellClasses.push("font-bold")
                              cellStyle.fontWeight = "bold"
                            }
                          }

                          // Check for failing marks (only if no backgroundColor already set from Excel)
                          const isFailingMark = (() => {
                            if (styling?.backgroundColor) return false // Don't override Excel colors
                            if (cellValue === null || cellValue === undefined || cellValue === "") return false

                            const numericValue =
                              typeof cellValue === "number" ? cellValue : Number.parseFloat(String(cellValue).trim())
                            if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) return false

                            const hasStudentDataInRow = visibleRows[actualRowIndex].some((cell: any) => {
                              const val = String(
                                cell && typeof cell === "object" && "value" in cell ? cell.value || "" : cell || "",
                              )
                              return /^\d{6,}$/.test(val.trim())
                            })

                            if (!hasStudentDataInRow) return false

                            let isMarkColumn = false

                            for (let checkRow = 0; checkRow < Math.min(5, visibleRows.length); checkRow++) {
                              const headerCell = visibleRows[checkRow]?.[cellIndex]
                              const headerText = String(
                                headerCell && typeof headerCell === "object" && "value" in headerCell
                                  ? headerCell.value || ""
                                  : headerCell || "",
                              ).toLowerCase()

                              if (
                                headerText.includes("mark") ||
                                headerText.includes("score") ||
                                headerText.includes("test") ||
                                headerText.includes("exam") ||
                                headerText.includes("assessment") ||
                                headerText.includes("assignment") ||
                                headerText.includes("cat") ||
                                headerText.includes("final") ||
                                (headerText.includes("total") && !headerText.includes("credit")) ||
                                (headerText.includes("grade") && !headerText.includes("point"))
                              ) {
                                isMarkColumn = true
                                break
                              }
                            }

                            if (!isMarkColumn) {
                              for (let checkRow = 0; checkRow < Math.min(3, actualRowIndex); checkRow++) {
                                const moduleCell = visibleRows[checkRow]?.[cellIndex]
                                const moduleText = String(
                                  moduleCell && typeof moduleCell === "object" && "value" in moduleCell
                                    ? moduleCell.value || ""
                                    : moduleCell || "",
                                )
                                if (/^[A-Z]{3,4}\d{3,4}$/i.test(moduleText.trim())) {
                                  isMarkColumn = true
                                  break
                                }
                              }
                            }

                            if (!isMarkColumn && cellIndex > 2 && cellIndex < 20) {
                              isMarkColumn = true
                            }

                            return numericValue < 50 && isMarkColumn
                          })()

                          // Apply failing mark styling only if no Excel background color
                          if (isFailingMark && !styling?.backgroundColor) {
                            cellStyle.backgroundColor = "#fecaca"
                            cellStyle.color = "#dc2626"
                            cellStyle.fontWeight = "bold"
                          }

                          return (
                            <TableCell
                              key={cellIndex}
                              className={cellClasses.join(" ")}
                              style={cellStyle}
                              rowSpan={rowSpan}
                              colSpan={colSpan}
                            >
                              <div
                                className="truncate"
                                title={styling?.comment ? undefined : String(cellValue || "")}
                                style={{ lineHeight: "1.2", minHeight: "16px" }}
                              >
                                {renderCellContent(cellValue, styling, rowSpan, colSpan)}
                              </div>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
