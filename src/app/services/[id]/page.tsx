"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Building, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface ServiceRequest {
  studentId: string
  serviceType: string
  department: string
  school: string
  requestDate?: string
  approvedDate?: string
  rejectedDate?: string
  priority?: string
  status?: string
  reason?: string
  studentName?: string
  studentEmail?: string
  studentPhone?: string
  description?: string
  attachments?: string[]
  timeline?: Array<{
    date: string
    action: string
    description: string
    status: string
  }>
}

export default function ServiceRequestView({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data - in a real app, this would be fetched from an API
  const mockData: ServiceRequest[] = [
    {
      studentId: "UR-2024-001",
      serviceType: "Academic Appeal",
      department: "Computer Science",
      school: "School of Science & Technology",
      requestDate: "2025-09-15",
      priority: "High",
      studentName: "John Doe",
      studentEmail: "john.doe@university.edu",
      studentPhone: "+1-555-0123",
      description: "Requesting appeal for CS-101 midterm grade due to medical emergency during exam period. Doctor's note and medical records attached.",
      attachments: ["medical_certificate.pdf", "doctor_note.pdf", "exam_schedule.pdf"],
      timeline: [
        {
          date: "2025-09-15",
          action: "Request Submitted",
          description: "Student submitted academic appeal request",
          status: "completed"
        },
        {
          date: "2025-09-16",
          action: "Under Review",
          description: "Request forwarded to department head for review",
          status: "completed"
        },
        {
          date: "2025-09-17",
          action: "Pending Principal Approval",
          description: "Awaiting Principal's decision",
          status: "pending"
        }
      ]
    },
    {
      studentId: "UR-2024-045",
      serviceType: "Special Exam Request",
      department: "Business Administration",
      school: "School of Business",
      requestDate: "2025-09-18",
      priority: "Medium",
      studentName: "Jane Smith",
      studentEmail: "jane.smith@university.edu",
      studentPhone: "+1-555-0456",
      description: "Requesting special examination for BUS-201 due to family emergency. Supporting documentation provided.",
      attachments: ["family_emergency_document.pdf", "exam_request_form.pdf"],
      timeline: [
        {
          date: "2025-09-18",
          action: "Request Submitted",
          description: "Student submitted special exam request",
          status: "completed"
        },
        {
          date: "2025-09-19",
          action: "Under Review",
          description: "Request under review by academic committee",
          status: "in_progress"
        }
      ]
    },
    {
      studentId: "UR-2023-156",
      serviceType: "Hostel Application",
      department: "Civil Engineering",
      school: "School of Engineering",
      requestDate: "2025-09-16",
      priority: "Low",
      studentName: "Mike Johnson",
      studentEmail: "mike.johnson@university.edu",
      studentPhone: "+1-555-0789",
      description: "Application for hostel accommodation for the upcoming semester. All required documents submitted.",
      attachments: ["hostel_application.pdf", "financial_documents.pdf", "id_copy.pdf"],
      timeline: [
        {
          date: "2025-09-16",
          action: "Application Submitted",
          description: "Hostel application submitted with all documents",
          status: "completed"
        },
        {
          date: "2025-09-17",
          action: "Document Verification",
          description: "Documents under verification by housing office",
          status: "in_progress"
        }
      ]
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchServiceRequest = async () => {
      setLoading(true)
      // In a real app, you would fetch from an API using the params.id
      const request = mockData.find(req => req.studentId === params.id)
      setServiceRequest(request || null)
      setLoading(false)
    }

    fetchServiceRequest()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#026892] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service request...</p>
        </div>
      </div>
    )
  }

  if (!serviceRequest) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Request Not Found</h2>
        <p className="text-gray-600 mb-4">The requested service request could not be found.</p>
        <Button onClick={() => router.back()} variant="outline" className="bg-[#026892] hover:bg-[#026892]/90">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'pending': return <AlertCircle className="h-4 w-4 text-blue-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className=" text-gray-500 flex items-center hover:bg-gray-100 transition-colors border-none hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Service Request Details</h1>
          <p className="text-gray-600 text-lg">Student ID: {serviceRequest.studentId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Request Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Service Type</label>
                  <p className="text-lg font-semibold text-black">{serviceRequest.serviceType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <div className="mt-1">
                    <Badge className={getPriorityColor(serviceRequest.priority || '')}>
                      {serviceRequest.priority}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-black">{serviceRequest.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">School</label>
                  <p className="text-[#026892] font-medium">{serviceRequest.school}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Request Date</label>
                  <p className="text-black">{serviceRequest.requestDate}</p>
                </div>
                {serviceRequest.approvedDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Approved Date</label>
                    <p className="text-green-600 font-medium">{serviceRequest.approvedDate}</p>
                  </div>
                )}
                {serviceRequest.rejectedDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rejected Date</label>
                    <p className="text-red-600 font-medium">{serviceRequest.rejectedDate}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md">
                  {serviceRequest.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Student Name</label>
                  <p className="text-black font-medium">{serviceRequest.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Student ID</label>
                  <p className="text-black font-mono">{serviceRequest.studentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-black">{serviceRequest.studentEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-black">{serviceRequest.studentPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {serviceRequest.attachments && serviceRequest.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>Documents submitted with this request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {serviceRequest.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{attachment}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline
              </CardTitle>
              <CardDescription>Request processing timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceRequest.timeline?.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{event.action}</p>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-[#026892] hover:bg-[#026892]/90">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Request
              </Button>
              <Button variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Request
              </Button>
              <Button variant="outline" className="w-full">
                Request More Info
              </Button>
              <Button variant="outline" className="w-full">
                Forward to Department
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}