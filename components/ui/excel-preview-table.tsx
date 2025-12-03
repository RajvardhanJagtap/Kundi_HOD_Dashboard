"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
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
  hideTopMeta?: boolean;
  startAtHeader?: boolean;
}

export function ExcelPreviewTable({
  data,
  onDownload,
  isDownloadLoading = false,
  hideTopMeta = false,
  startAtHeader = false,
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

  // If hideTopMeta is enabled, determine the index to cut rows above.
  // If startAtHeader is true, find the first row that looks like the main table header (contains SN and REF).
  // Otherwise, prefer the last YEAR row (e.g., 'YEAR 1') and start from there; fallback to SN/REF.
  const topMetaCutIndex = React.useMemo(() => {
    if (!hideTopMeta || !visibleRows || visibleRows.length === 0) return -1;

    const yearRegex = /\bYEAR\s*(?:I{1,3}|IV|V|\d+)\b/i;

    if (startAtHeader) {
      // Expanded list of column headers that might appear in a marks table
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
      ];

      for (let i = 0; i < visibleRows.length; i++) {
        const row = visibleRows[i];
        const rowText = row
          .map((c: any) => {
            if (c === null || c === undefined) return "";
            if (typeof c === "object" && "value" in c)
              return String(c.value || "");
            return String(c);
          })
          .join(" ")
          .toUpperCase()
          .replace(/\s+/g, " "); // normalize whitespace

        // Count how many header indicators are present in this row
        let matchCount = 0;
        for (const h of headerIndicators) {
          if (rowText.includes(h.toUpperCase())) matchCount++;
        }

        // If at least 3 indicators are present, assume this is the header row
        if (matchCount >= 3) return i;
      }
      return -1;
    }

    let lastYearMatch = -1;
    for (let i = 0; i < visibleRows.length; i++) {
      const row = visibleRows[i];
      const rowText = row
        .map((c: any) => {
          if (c === null || c === undefined) return "";
          if (typeof c === "object" && "value" in c)
            return String(c.value || "");
          return String(c);
        })
        .join(" ")
        .toUpperCase();

      // Track the last YEAR row
      if (yearRegex.test(rowText)) {
        lastYearMatch = i;
        continue;
      }

      // Look for the actual table header (SN + REF or other header indicators)
      if (
        rowText.includes("SN") &&
        (rowText.includes("REF") ||
          rowText.includes("REF.NO") ||
          rowText.includes("REF NO") ||
          rowText.includes("SEX") ||
          rowText.includes("MATRIC"))
      ) {
        // Return this header row index (which hides everything before it)
        return i;
      }
    }

    // If we found a YEAR row but no header, return the row after the last YEAR (to skip YEAR and empty rows)
    if (lastYearMatch >= 0) {
      return lastYearMatch + 1;
    }

    return -1;
  }, [hideTopMeta, startAtHeader, visibleRows]);

  // Detect header rows and their types for styling
  const headerRowInfo = React.useMemo(() => {
    const headerRowMap = new Map<number, "main" | "semester" | "modules">();

    if (!hideTopMeta || !visibleRows || visibleRows.length === 0) {
      return headerRowMap;
    }

    // Find the cut index to know where headers start
    const startIndex = topMetaCutIndex >= 0 ? topMetaCutIndex : 0;

    // Check ALL visible rows (not just the first 5) to identify all header rows throughout the sheet
    for (let i = startIndex; i < visibleRows.length; i++) {
      const row = visibleRows[i];
      const rowText = row
        .map((c: any) => {
          if (c === null || c === undefined) return "";
          if (typeof c === "object" && "value" in c)
            return String(c.value || "");
          return String(c);
        })
        .join(" ")
        .toUpperCase();

      // Check if this is the main header row (contains SN, REF, SEX, etc.)
      if (
        rowText.includes("SN") &&
        (rowText.includes("REF") ||
          rowText.includes("SEX") ||
          rowText.includes("MATRIC"))
      ) {
        headerRowMap.set(i, "main");
      }
      // Check if this is a module code header row (contains MODULE CODE, MODULE TITLE)
      else if (
        (rowText.includes("MODULE") && rowText.includes("CODE")) ||
        (rowText.includes("MODULE") && rowText.includes("TITLE"))
      ) {
        headerRowMap.set(i, "modules");
      }
      // Check if this is a semester/secondary header row (contains SEMESTER, OBSERVATIONS, TOTAL CREDITS, etc.)
      else if (
        rowText.includes("SEMESTER") ||
        rowText.includes("OBSERVATION") ||
        (rowText.includes("TOTAL") && rowText.includes("CREDIT")) ||
        rowText.includes("REMARK") ||
        rowText.includes("ANNUAL")
      ) {
        headerRowMap.set(i, "semester");
      }
    }

    return headerRowMap;
  }, [topMetaCutIndex, hideTopMeta, visibleRows]);

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

                    // If configured to hide top meta rows, skip anything above the detected cut index
                    if (
                      topMetaCutIndex >= 0 &&
                      actualRowIndex < topMetaCutIndex
                    ) {
                      return null;
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

                          const rowText = visibleRows[actualRowIndex]
                            .map((c: any) => {
                              if (c === null || c === undefined) return "";
                              if (typeof c === "object" && "value" in c)
                                return String(c.value || "");
                              return String(c);
                            })
                            .join(" ")
                            .toLowerCase();

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
                            rowText.includes("credit");

                          const hasStudentData = visibleRows[
                            actualRowIndex
                          ].some((cell: any) => {
                            const val = String(
                              cell &&
                                typeof cell === "object" &&
                                "value" in cell
                                ? cell.value || ""
                                : cell || ""
                            );
                            // Check if cell contains registration number pattern or marks
                            return (
                              /^\d{6,}$/.test(val.trim()) || // Long numbers (reg numbers)
                              (/^\d+\.?\d*$/.test(val.trim()) &&
                                parseFloat(val) > 0 &&
                                parseFloat(val) <= 100)
                            ); // Marks
                          });

                          // First row is always header, or rows with header keywords but no student data
                          const isHeaderRow =
                            actualRowIndex === 0 ||
                            (actualRowIndex < 3 &&
                              hasHeaderKeywords &&
                              !hasStudentData &&
                              !rowText.includes("summary statistics") &&
                              !rowText.includes("performance summary") &&
                              !rowText.includes("total students") &&
                              !rowText.includes("students passed") &&
                              !rowText.includes("average score"));

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
                            // Apply the same border styling as marks-submitted
                            borderTop: "1.5px solid",
                            borderRight: "1.5px solid",
                            borderBottom: "1.5px solid",
                            borderLeft: "1.5px solid",
                            borderColor: isHeaderRow
                              ? "#9ca3af" // gray-400 for headers
                              : "#d1d5db", // gray-300 for data rows
                          };

                          const cellClasses = ["text-xs", "relative"];

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

                          // Special styling for header rows
                          if (headerRowInfo.has(actualRowIndex)) {
                            const headerType =
                              headerRowInfo.get(actualRowIndex);
                            const cellValueStr = String(cellValue || "")
                              .toUpperCase()
                              .trim();

                            // Only apply background color if the cell contains relevant header content (non-empty)
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
                                cellValueStr.includes("OBSERVATION"));

                            // Apply background colors based on header type - only for cells with actual header content
                            if (isHeaderCell) {
                              if (headerType === "main") {
                                cellStyle.backgroundColor = "#c8e6c9"; // Light green
                              } else if (headerType === "modules") {
                                cellStyle.backgroundColor = "#c8e6c9"; // Light green
                              } else if (headerType === "semester") {
                                cellStyle.backgroundColor = "#d1c4e9"; // Light purple
                              }
                            }

                            // Make meta columns bold
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
                              cellClasses.push("font-bold");
                              cellStyle.fontWeight = "bold";
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
