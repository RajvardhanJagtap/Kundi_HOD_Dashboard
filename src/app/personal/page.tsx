import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Settings, Bell, LogOut } from "lucide-react"

export default function PersonalPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Personal Settings</h1>
      <p className="text-gray-600 text-sm">Manage your personal profile, settings, and communications.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">My Profile</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              View and update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-gray-800">
            <p>
              Name: <span className="font-medium">John Doe</span>
            </p>
            <p>
              Role: <span className="font-medium">Head of Department</span>
            </p>
            <p>
              Email: <span className="font-medium">john.doe@example.com</span>
            </p>
            <p>
              Department: <span className="font-medium">Computer Science</span>
            </p>
            <p>
              Employee ID: <span className="font-medium">EMP001</span>
            </p>
            <Button size="sm" className="mt-4 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
              <User className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Account Settings</CardTitle>
            <CardDescription className="text-sm text-gray-600">Manage your account preferences.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              size="sm"
              variant="outline"
              className="justify-start gap-2 text-gray-700 hover:bg-gray-100 bg-transparent"
            >
              <Settings className="h-4 w-4" /> General Settings
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="justify-start gap-2 text-gray-700 hover:bg-gray-100 bg-transparent"
            >
              <Bell className="h-4 w-4" /> Notification Preferences
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="justify-start gap-2 text-samps-red-600 hover:bg-samps-red-50 bg-transparent"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
