import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Shield } from "lucide-react";
import ProjectsOverview from "../components/ProjectsOverview";
import Dashboard from "../components/Dashboard";
import AlertsPanel from "../components/AlertsPanel";
import ManagerManagement from "../components/ManagerManagement";
import PerformanceAnalytics from "../components/PerformanceAnalytics";

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage = ({ onLogout }: DashboardPageProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border/50 shadow-soft">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-elegant">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">HQ Admin Portal</h1>
              <p className="text-sm text-muted-foreground">Performance Monitoring System</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HQ Dashboard</CardTitle>
                <CardDescription>
                  Overview of system performance and key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects Overview</CardTitle>
                <CardDescription>
                  Manage and monitor all active projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectsOverview />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alerts Panel</CardTitle>
                <CardDescription>
                  Monitor system alerts and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="managers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manager Management</CardTitle>
                <CardDescription>
                  Manage team managers and their assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ManagerManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Detailed performance metrics and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceAnalytics />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
