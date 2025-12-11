"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { CellData } from "@/hooks/module-marks/useMarkSheet"

interface ExcelTableRendererProps {
  styledData: CellData[][]
  columnWidths: number[]
  formatCellValue: (value: any) => string
}

export function ExcelTableRenderer({ styledData, columnWidths, formatCellValue }: ExcelTableRendererProps) {
  if (!styledData || styledData.length === 0) {
    return null
  }

  return (
    <TooltipProvider>
      <table 
        className="w-full text-xs" 
        style={{ 
          borderCollapse: "collapse", 
          tableLayout: "fixed",
          minWidth: columnWidths.reduce((sum, w) => sum + w, 0) + "px"
        }}
      >
        <colgroup>
          {columnWidths.map((width, index) => (
            <col key={index} style={{ width: `${width}px` }} />
          ))}
        </colgroup>
        <tbody>
          {styledData.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cellData, cellIndex) => {
                if (cellData.isMergedChild) {
                  return null
                }

                const cellValue = formatCellValue(cellData.value)
                const isEmpty = cellValue === ""
                const cellStyling = cellData.styling || {}
                const hasComment = !!cellStyling.comment

                // Build inline styles from Excel styling
                const cellStyle: React.CSSProperties = {
                  fontSize: "11px",
                  border: "1px solid #d1d5db",
                  position: "relative",
                  padding: "2px 4px",
                  verticalAlign: "middle",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  height: "20px",
                  lineHeight: "20px",
                }

                // Apply Excel background color if exists
                if (cellStyling.backgroundColor) {
                  cellStyle.backgroundColor = cellStyling.backgroundColor
                }

                // Apply Excel font color if exists
                if (cellStyling.color) {
                  cellStyle.color = cellStyling.color
                }

                // Apply text alignment
                if (cellStyling.textAlign) {
                  cellStyle.textAlign = cellStyling.textAlign as any
                } else {
                  cellStyle.textAlign = "center"
                }

                const tdProps: React.TdHTMLAttributes<HTMLTableCellElement> = {
                  style: cellStyle,
                  className: `${cellStyling.fontWeight === "bold" ? "font-bold" : ""} ${cellStyling.fontStyle === "italic" ? "italic" : ""}`,
                }

                if (cellData.rowSpan && cellData.rowSpan > 1) {
                  tdProps.rowSpan = cellData.rowSpan
                }
                if (cellData.colSpan && cellData.colSpan > 1) {
                  tdProps.colSpan = cellData.colSpan
                }

                const cellContent = (
                  <td key={`cell-${rowIndex}-${cellIndex}`} {...tdProps}>
                    {cellValue}
                    {hasComment && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 0,
                          height: 0,
                          borderLeft: "8px solid transparent",
                          borderTop: "8px solid #ef4444",
                        }}
                      />
                    )}
                  </td>
                )

                if (hasComment) {
                  return (
                    <Tooltip key={`tooltip-${rowIndex}-${cellIndex}`} delayDuration={100}>
                      <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-xs bg-[#ffffc0] text-black border border-black p-2 text-xs z-[9999]"
                      >
                        {cellStyling.comment}
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return cellContent
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </TooltipProvider>
  )
}
