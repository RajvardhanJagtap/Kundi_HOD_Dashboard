"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText } from "lucide-react"
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Legend, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const auditFindingsData = [
  { name: "Minor Non-conformities", value: 5 },
  { name: "Major Non-conformities", value: 1 },
  { name: "Observations", value: 10 },
]
const PIE_COLORS = ["#026892", "#38A06C", "#C2410C"]

export default function AuditsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quality Audits</h1>
      <p className="text-gray-600 text-sm">Manage and review internal and external quality audits.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Audit Schedule</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <PlusCircle className="h-4 w-4" />
            Schedule Audit
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Audit Type</TableHead>
                <TableHead className="text-gray-700">Date</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">Auditor</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Internal Department Audit</TableCell>
                <TableCell className="text-gray-700">2024-09-15</TableCell>
                <TableCell className="text-samps-orange-600">Scheduled</TableCell>
                <TableCell className="text-gray-700">QA Committee</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> View Plan
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">External Accreditation Audit</TableCell>
                <TableCell className="text-gray-700">2023-11-01</TableCell>
                <TableCell className="text-samps-green-600">Completed</TableCell>
                <TableCell className="text-gray-700">External Body</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> View Report
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Internal Process Audit</TableCell>
                <TableCell className="text-gray-700">2024-07-01</TableCell>
                <TableCell className="text-samps-green-600">Completed</TableCell>
                <TableCell className="text-gray-700">Internal Auditor</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> View Report
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Audit Findings Overview</CardTitle>
          <CardDescription className="text-sm text-gray-600">Summary of findings from recent audits.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Count",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={auditFindingsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#026892"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {auditFindingsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
