"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { type ExcelSheetData } from "@/lib/api-grading";

/**
 * Enhanced Excel Preview Table Component
 *
 * Features:
 * - Full support for merged cells with rowspan and colspan
 * - Rich cell styling preservation (fonts, colors, alignment, borders)
 * - Performance optimized with memoized lookups
 * - Maintains original blue theme (#026892)
 * - Proper cell skipping for merged ranges
 * - Excel-like appearance and behavior
 * - Responsive design with proper overflow handling
 */

interface ExcelPreviewTableProps {
  data: ExcelSheetData[];
  onDownload?: () => void;
  isDownloadLoading?: boolean;
}

export function ExcelPreviewTable({
  data,
  onDownload,
  isDownloadLoading = false,
}: ExcelPreviewTableProps) {
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentSheet = data[currentSheetIndex];

  if (!currentSheet) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            No data available to preview
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show all rows without pagination
  const visibleRows = currentSheet.rows;

  // Memoize merged cells lookup for performance
  const mergedCellsLookup = React.useMemo(() => {
    const lookup = new Map<
      string,
      {
        startRow: number;
        startCol: number;
        endRow: number;
        endCol: number;
        value: any;
      }
    >();

    if (currentSheet.mergedCells) {
      currentSheet.mergedCells.forEach((merge) => {
        for (let row = merge.startRow; row <= merge.endRow; row++) {
          for (let col = merge.startCol; col <= merge.endCol; col++) {
            lookup.set(`${row}-${col}`, merge);
          }
        }
      });
    }

    return lookup;
  }, [currentSheet.mergedCells]);

  return (
    <>
      <style jsx>{`
        .excel-preview-container {
          width: 100%;
          max-width: 100vw;
          overflow: visible;
        }
        .excel-table-scroll {
          width: 100%;
          max-width: 100vw;
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
          width: 100%;
        }
      `}</style>

      <div
        className={`excel-preview-container ${
          isExpanded ? "fixed inset-4 z-50 bg-white shadow-2xl rounded-lg" : ""
        }`}
      >
        <Card className="h-full">
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
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Sheet Tabs */}
            {data.length > 1 && (
              <div className="border-b bg-gray-50 px-4 py-2">
                <div className="flex gap-1 overflow-x-auto">
                  {data.map((sheet, index) => (
                    <Button
                      key={index}
                      variant={
                        index === currentSheetIndex ? "default" : "ghost"
                      }
                      size="sm"
                      className={`
                        flex-shrink-0 text-xs font-medium px-3 py-1
                        ${
                          index === currentSheetIndex
                            ? "bg-[#026892] text-white hover:bg-[#025f7f]"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }
                      `}
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
            <div
              className={`excel-table-scroll ${
                isExpanded ? "h-[calc(100vh-200px)]" : "h-96"
              }`}
            >
              <Table className="border-collapse excel-preview-table-auto-width text-sm">
                <TableBody>
                  {visibleRows.map((row, rowIndex) => {
                    const actualRowIndex = rowIndex;

                    return (
                      <TableRow
                        key={actualRowIndex}
                        className={`border-b border-gray-200 hover:bg-blue-50/50 ${
                          actualRowIndex % 2 === 1
                            ? "bg-gray-50/50"
                            : "bg-white"
                        }`}
                      >
                        {row.map((cell, cellIndex) => {
                          // Check if this cell should be skipped due to being part of a merged range
                          const mergeInfo = mergedCellsLookup.get(
                            `${actualRowIndex + 1}-${cellIndex}`
                          );
                          const isTopLeftOfMerge =
                            mergeInfo &&
                            actualRowIndex + 1 === mergeInfo.startRow &&
                            cellIndex === mergeInfo.startCol;

                          // Skip if part of merge but not top-left
                          if (mergeInfo && !isTopLeftOfMerge) {
                            return null;
                          }

                          // Handle both old format (simple values) and new format (cell objects with styling)
                          const cellValue =
                            cell && typeof cell === "object" && "value" in cell
                              ? cell.value
                              : cell;
                          const styling =
                            cell &&
                            typeof cell === "object" &&
                            "styling" in cell
                              ? cell.styling
                              : null;

                          // Build style object for the cell
                          const cellStyle: React.CSSProperties = {
                            whiteSpace: styling?.wrapText
                              ? "pre-wrap"
                              : "normal",
                            minWidth: "40px", // reduce min width for summary
                            maxWidth: "160px",
                            padding: "6px 8px",
                            verticalAlign: "middle",
                            fontSize: "12px",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          };

                          const cellClasses = [
                            "border-r",
                            "border-gray-200",
                            "last:border-r-0",
                            "text-xs",
                            "relative",
                          ];

                          // Initialize rowspan and colspan
                          let rowSpan: number | undefined = undefined;
                          let colSpan: number | undefined = undefined;

                          if (styling) {
                            // Apply font styling
                            if (styling.bold) cellClasses.push("font-bold");
                            if (styling.italic) cellClasses.push("italic");
                            if (styling.underline)
                              cellClasses.push("underline");

                            // Apply colors
                            if (styling.color) cellStyle.color = styling.color;
                            if (styling.backgroundColor)
                              cellStyle.backgroundColor =
                                styling.backgroundColor;

                            // Apply font size and family
                            if (styling.fontSize)
                              cellStyle.fontSize = `${Math.min(
                                styling.fontSize,
                                14
                              )}px`;
                            if (styling.fontFamily)
                              cellStyle.fontFamily = styling.fontFamily;

                            // Apply alignment
                            if (styling.alignment) {
                              if (styling.alignment === "center")
                                cellClasses.push("text-center");
                              else if (styling.alignment === "right")
                                cellClasses.push("text-right");
                              else if (styling.alignment === "left")
                                cellClasses.push("text-left");
                            }

                            // Apply border
                            if (styling.border) {
                              cellStyle.border = styling.border;
                            }

                            // Handle merged cells - calculate rowspan and colspan
                            if (styling.merged && styling.mergeRange) {
                              const [startRow, startCol, endRow, endCol] =
                                styling.mergeRange;
                              const calculatedRowSpan = endRow - startRow + 1;
                              const calculatedColSpan = endCol - startCol + 1;

                              // Only apply spans if they are greater than 1
                              if (calculatedRowSpan > 1)
                                rowSpan = calculatedRowSpan;
                              if (calculatedColSpan > 1)
                                colSpan = calculatedColSpan;

                              // Center content for merged cells
                              if (
                                (rowSpan && rowSpan > 1) ||
                                (colSpan && colSpan > 1)
                              ) {
                                cellClasses.push("text-center");
                                cellStyle.textAlign = "center";
                                cellStyle.verticalAlign = "middle";
                              }
                            }
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
                                title={String(cellValue || "")}
                                style={{
                                  lineHeight: "1.2",
                                  minHeight: "16px",
                                }}
                              >
                                {(() => {
                                  if (
                                    cellValue === null ||
                                    cellValue === undefined ||
                                    cellValue === ""
                                  ) {
                                    return (
                                      <span className="text-transparent select-none">
                                        -
                                      </span>
                                    );
                                  }

                                  const textColor = styling?.color || "inherit";
                                  const isMergedCell =
                                    (rowSpan && rowSpan > 1) ||
                                    (colSpan && colSpan > 1);

                                  if (typeof cellValue === "number") {
                                    return (
                                      <span
                                        className={
                                          isMergedCell
                                            ? "font-mono text-center"
                                            : "text-right font-mono"
                                        }
                                        style={{ color: textColor }}
                                      >
                                        {cellValue.toLocaleString()}
                                      </span>
                                    );
                                  }
                                  if (typeof cellValue === "boolean") {
                                    return (
                                      <span
                                        className="text-center font-medium"
                                        style={{ color: textColor }}
                                      >
                                        {cellValue ? "TRUE" : "FALSE"}
                                      </span>
                                    );
                                  }
                                  const stringValue = String(cellValue).trim();
                                  if (stringValue === "") {
                                    return (
                                      <span className="text-transparent select-none">
                                        -
                                      </span>
                                    );
                                  }
                                  return (
                                    <span style={{ color: textColor }}>
                                      {stringValue}
                                    </span>
                                  );
                                })()}
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
