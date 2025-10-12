import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Lock, 
  Building, 
  CheckCircle, 
  AlertTriangle,
  FolderOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  User
} from "lucide-react";
import api from '../services/api';

interface ManagerForm {
  name: string;
  email: string;
  password: string;
  dept: string;
}

interface Project {
  _id: string;
  title: string;
  status: 'Ongoing' | 'Completed' | 'Delayed';
  deadline: string;
  budget: number;
  createdAt: string;
}

interface Manager {
  _id: string;
  name: string;
  email: string;
  dept?: string;
  createdAt: string;
  projects: Project[];
  projectCount: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
}

export default function ManagerManagement() {
  const [form, setForm] = useState<ManagerForm>({ 
    name: '', 
    email: '', 
    password: '', 
    dept: '' 
  });
  const [managers, setManagers] = useState<Manager[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [managersLoading, setManagersLoading] = useState(true);
  const [managersError, setManagersError] = useState('');

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    setManagersLoading(true);
    setManagersError('');
    try {
      const res = await api.get('/hq/managers-with-projects');
      setManagers(res.data || []);
    } catch (e) {
      setManagersError('Failed to load managers');
    } finally {
      setManagersLoading(false);
    }
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');
    setError('');
    setLoading(true);
    
    try {
      await api.post('/auth/register-manager', form);
      setStatus('Manager created successfully');
      setForm({ name: '', email: '', password: '', dept: '' });
      // Reload managers list to show the new manager
      await loadManagers();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create manager');
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Delayed':
        return 'destructive';
      case 'Ongoing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Create Manager Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create New Manager
          </CardTitle>
          <CardDescription>Add new managers to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter manager name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Department
              </Label>
              <Input
                id="dept"
                value={form.dept}
                onChange={(e) => setForm({ ...form, dept: e.target.value })}
                placeholder="Enter department"
              />
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Manager'}
              </Button>

              {status && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <Badge variant="default" className="mr-2">Success</Badge>
                    {status}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <Badge variant="destructive" className="mr-2">Error</Badge>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Managers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Managers
          </CardTitle>
          <CardDescription>View all managers and their assigned projects</CardDescription>
        </CardHeader>
        <CardContent>
          {managersLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(2)].map((_, j) => (
                      <Skeleton key={j} className="h-3 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : managersError ? (
            <Alert variant="destructive">
              <AlertDescription>{managersError}</AlertDescription>
            </Alert>
          ) : managers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No managers found.</p>
              <p className="text-sm">Create your first manager using the form on the left.</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                {managers.map((manager) => (
                  <div key={manager._id} className="border rounded-lg p-4 space-y-4">
                    {/* Manager Info */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{manager.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {manager.email}
                          </span>
                          {manager.dept && (
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {manager.dept}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {formatDate(manager.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {manager.projectCount} Projects
                      </Badge>
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-secondary/50 rounded">
                        <div className="text-lg font-semibold text-secondary-foreground">
                          {manager.activeProjects}
                        </div>
                        <div className="text-xs text-muted-foreground">Active</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-lg font-semibold text-green-700">
                          {manager.completedProjects}
                        </div>
                        <div className="text-xs text-green-600">Completed</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="text-lg font-semibold text-red-700">
                          {manager.delayedProjects}
                        </div>
                        <div className="text-xs text-red-600">Delayed</div>
                      </div>
                    </div>

                    {/* Projects List */}
                    {manager.projects.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          Assigned Projects
                        </h4>
                        <div className="space-y-2">
                          {manager.projects.slice(0, 3).map((project) => (
                            <div key={project._id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                              <div className="flex-1">
                                <div className="font-medium">{project.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  Due: {formatDate(project.deadline)} • {formatCurrency(project.budget)}
                                </div>
                              </div>
                              <Badge variant={getStatusBadgeVariant(project.status)} className="text-xs">
                                {project.status}
                              </Badge>
                            </div>
                          ))}
                          {manager.projects.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center py-1">
                              +{manager.projects.length - 3} more projects
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No projects assigned</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}