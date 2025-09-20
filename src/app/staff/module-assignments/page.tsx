"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface Lecturer {
  id: string
  name: string
  specialization: string
  capacityHours: number
  currentHours: number
}

interface Module {
  code: string
  name: string
  yearOfStudy: number
  semester: string
  credits: number
  hours: number
}

interface AssignmentRow {
  id: string
  moduleCode: string
  lecturerId: string
  yearOfStudy: number
  semester: string
}

const YEARS_OF_STUDY = [1, 2, 3, 4]
const SEMESTERS = ["Semester 1", "Semester 2"]

const LECTURERS: Lecturer[] = [
  { id: "l1", name: "Dr. Alice Smith", specialization: "Software Engineering", capacityHours: 16, currentHours: 8 },
  { id: "l2", name: "Prof. Bob Johnson", specialization: "Data Science", capacityHours: 16, currentHours: 10 },
  { id: "l3", name: "Dr. Sarah Lee", specialization: "AI/ML", capacityHours: 12, currentHours: 6 },
  { id: "l4", name: "Ms. Carol White", specialization: "Databases", capacityHours: 14, currentHours: 12 },
]

const MODULES: Module[] = [
  { code: "CSC101", name: "Intro to Computer Science", yearOfStudy: 1, semester: "Semester 1", credits: 12, hours: 4 },
  { code: "CSC102", name: "Programming Fundamentals", yearOfStudy: 1, semester: "Semester 2", credits: 12, hours: 4 },
  { code: "CSC201", name: "Object Oriented Programming", yearOfStudy: 2, semester: "Semester 1", credits: 12, hours: 4 },
  { code: "CSC203", name: "Data Structures & Algorithms", yearOfStudy: 2, semester: "Semester 1", credits: 12, hours: 4 },
  { code: "CSC205", name: "Database Systems", yearOfStudy: 2, semester: "Semester 2", credits: 12, hours: 4 },
  { code: "CSC301", name: "Software Engineering", yearOfStudy: 3, semester: "Semester 1", credits: 12, hours: 4 },
  { code: "CSC305", name: "Machine Learning", yearOfStudy: 3, semester: "Semester 2", credits: 12, hours: 4 },
  { code: "CSC401", name: "Final Year Project I", yearOfStudy: 4, semester: "Semester 1", credits: 15, hours: 3 },
  { code: "CSC402", name: "Final Year Project II", yearOfStudy: 4, semester: "Semester 2", credits: 15, hours: 3 },
]

export default function ModuleAssignmentsPage() {
  const [selectedYearOfStudy, setSelectedYearOfStudy] = useState<number>(1)
  const [selectedSemester, setSelectedSemester] = useState<string>("Semester 1")
  const [moduleCode, setModuleCode] = useState<string>("")
  const [lecturerId, setLecturerId] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [assignments, setAssignments] = useState<AssignmentRow[]>([])

  const filteredModules = useMemo(
    () => MODULES.filter(m => m.yearOfStudy === selectedYearOfStudy && m.semester === selectedSemester && (m.code.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase()))),
    [selectedYearOfStudy, selectedSemester, search]
  )

  const workloadData = useMemo(() => {
    const base = LECTURERS.map(l => ({ name: l.name.split(" ")[1] || l.name, hours: l.currentHours, capacity: l.capacityHours }))
    for (const a of assignments) {
      const mod = MODULES.find(m => m.code === a.moduleCode)
      if (!mod) continue
      const row = base.find(b => LECTURERS.find(l => l.id === a.lecturerId)?.name.includes(b.name))
      if (row) row.hours += mod.hours
    }
    return base
  }, [assignments])

  const selectedModule = MODULES.find(m => m.code === moduleCode)
  const selectedLecturer = LECTURERS.find(l => l.id === lecturerId)

  const canAssign = !!(selectedYearOfStudy && selectedSemester && moduleCode && lecturerId)
  const hasConflict = useMemo(() => {
    if (!selectedModule || !selectedLecturer) return false
    const current = workloadData.find(w => selectedLecturer.name.includes(w.name))
    if (!current) return false
    return current.hours + selectedModule.hours > selectedLecturer.capacityHours
  }, [selectedModule, selectedLecturer, workloadData])

  function handleAssign() {
    if (!canAssign) return
    if (hasConflict) {
      toast.warning("This assignment exceeds the lecturer's capacity.")
    }
    const id = `${moduleCode}-${lecturerId}-${selectedYearOfStudy}-${selectedSemester}`
    if (assignments.some(a => a.id === id)) {
      toast.info("This assignment already exists.")
      return
    }
    setAssignments(prev => [...prev, { id, moduleCode, lecturerId, yearOfStudy: selectedYearOfStudy, semester: selectedSemester }])
    toast.success("Module assigned successfully!")
    setModuleCode("")
    setLecturerId("")
  }

  return (
    <div className="space-y-6">
      {/* Header with Year/Semester Selection */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Module Assignments</h1>
          <p className="text-gray-600 mt-1">Assign modules to lecturers for each year of study</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Year of Study:</label>
            <Select value={selectedYearOfStudy.toString()} onValueChange={(v) => setSelectedYearOfStudy(Number(v))}>
              <SelectTrigger className="bg-white w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS_OF_STUDY.map(y => (
                  <SelectItem key={y} value={y.toString()}>Year {y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Semester:</label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="bg-white w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEMESTERS.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button asChild variant="outline" className="bg-[#026892] hover:bg-[#026892]/90 text-white hover:text-white rounded-md">
            <Link href="/staff/workload">Back to Workload</Link>
          </Button>
        </div>
      </div>

      {/* Assignment Interface */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Module Selection Card */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Create Assignment</CardTitle>
              <div className="text-sm text-gray-600">
                Showing modules for <Badge variant="outline">Year {selectedYearOfStudy}</Badge> • <Badge variant="outline">{selectedSemester}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Search & Select Module</label>
                  <Input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search modules..." 
                    className="bg-white mb-2" 
                  />
                  <Select value={moduleCode} onValueChange={setModuleCode}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select module to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredModules.map(m => (
                        <SelectItem key={m.code} value={m.code}>
                          <div className="flex flex-col">
                            <span className="font-medium">{m.code}</span>
                            <span className="text-xs text-gray-600">{m.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedModule && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <div><strong>Credits:</strong> {selectedModule.credits}</div>
                      <div><strong>Weekly Hours:</strong> {selectedModule.hours}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Lecturer</label>
                  <Select value={lecturerId} onValueChange={setLecturerId}>
                    <SelectTrigger className="bg-white mt-8">
                      <SelectValue placeholder="Select lecturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {LECTURERS.map(l => (
                        <SelectItem key={l.id} value={l.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{l.name}</span>
                            <span className="text-xs text-gray-600">{l.specialization}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedLecturer && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <div><strong>Capacity:</strong> {selectedLecturer.capacityHours} hrs/week</div>
                      <div><strong>Current Load:</strong> {selectedLecturer.currentHours} hrs/week</div>
                      <div><strong>Available:</strong> {selectedLecturer.capacityHours - selectedLecturer.currentHours} hrs/week</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                {hasConflict && (
                  <Badge variant="destructive">⚠ Exceeds Capacity</Badge>
                )}
                <Button 
                  onClick={handleAssign} 
                  disabled={!canAssign} 
                  className="bg-[#026892] hover:bg-[#026892]/90"
                  size="lg"
                >
                  Assign Module
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Assignments */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                Current Assignments
                <Badge variant="secondary" className="ml-2">{assignments.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No assignments yet for Year {selectedYearOfStudy}, {selectedSemester}</p>
                  <p className="text-sm">Use the form above to create assignments</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-700">Module</TableHead>
                      <TableHead className="text-gray-700">Lecturer</TableHead>
                      <TableHead className="text-gray-700">Hours</TableHead>
                      <TableHead className="text-gray-700">Credits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map(a => {
                      const mod = MODULES.find(m => m.code === a.moduleCode)!
                      const lec = LECTURERS.find(l => l.id === a.lecturerId)!
                      return (
                        <TableRow key={a.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{mod.code}</div>
                              <div className="text-sm text-gray-600">{mod.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{lec.name}</div>
                              <div className="text-sm text-gray-600">{lec.specialization}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{mod.hours} hrs/week</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{mod.credits} credits</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Workload Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Lecturer Workload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {LECTURERS.map(lecturer => {
                  const currentLoad = workloadData.find(w => lecturer.name.includes(w.name))?.hours || lecturer.currentHours
                  const percentage = (currentLoad / lecturer.capacityHours) * 100
                  const isOverloaded = percentage > 100
                  
                  return (
                    <div key={lecturer.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{lecturer.name}</div>
                          <div className="text-xs text-gray-600">{lecturer.specialization}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{currentLoad}/{lecturer.capacityHours} hrs</div>
                          <div className={`text-xs ${
                            isOverloaded ? 'text-red-600' : percentage > 80 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {Math.round(percentage)}% capacity
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            isOverloaded ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Available Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredModules.map(module => {
                  const isAssigned = assignments.some(a => a.moduleCode === module.code)
                  return (
                    <div 
                      key={module.code} 
                      className={`p-2 rounded border text-sm ${
                        isAssigned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{module.code}</div>
                          <div className="text-xs text-gray-600">{module.hours} hrs • {module.credits} credits</div>
                        </div>
                        {isAssigned && (
                          <Badge variant="default" className="text-xs bg-green-600">✓ Assigned</Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

