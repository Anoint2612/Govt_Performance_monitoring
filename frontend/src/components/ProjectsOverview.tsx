import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, FolderOpen, Plus, DollarSign, FileText, Users } from "lucide-react";
import api from '../services/api';

interface Project {
  _id: string;
  projectId: string;
  title: string;
  details?: string;
  budget: number;
  deadline: string;
  status: 'Ongoing' | 'Completed' | 'Delayed';
  managerId: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Manager {
  _id: string;
  name: string;
  email: string;
  dept?: string;
}

interface ProjectForm {
  title: string;
  details: string;
  budget: string;
  deadline: string;
  managerId: string;
  status: 'Ongoing' | 'Completed' | 'Delayed';
}

export default function ProjectsOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [managersLoading, setManagersLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // Form state
  const [form, setForm] = useState<ProjectForm>({
    title: '',
    details: '',
    budget: '',
    deadline: '',
    managerId: '',
    status: 'Ongoing'
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get('/hq/projects');
        if (!cancelled) setProjects(res.data || []);
      } catch (e) {
        console.error('Error loading projects:', e);
        if (e.response?.status === 401) {
          if (!cancelled) setError('Authentication required. Please log in.');
        } else {
          if (!cancelled) setError('Failed to load projects: ' + (e.response?.data?.message || e.message));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    async function loadManagers() {
      setManagersLoading(true);
      try {
        const res = await api.get('/hq/managers');
        setManagers(res.data || []);
      } catch (e) {
        console.error('Failed to load managers:', e);
        if (e.response?.status === 401) {
          console.error('Authentication required for managers');
        }
      } finally {
        setManagersLoading(false);
      }
    }
    loadManagers();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    try {
      const projectData = {
        ...form,
        budget: Number(form.budget),
        deadline: new Date(form.deadline).toISOString()
      };

      const res = await api.post('/hq/projects', projectData);
      
      // Add the new project to the list
      setProjects(prev => [res.data, ...prev]);
      
      // Reset form
      setForm({
        title: '',
        details: '',
        budget: '',
        deadline: '',
        managerId: '',
        status: 'Ongoing'
      });
      
      setFormSuccess('Project created successfully!');
      setActiveTab('list');
    } catch (e: any) {
      setFormError(e.response?.data?.message || 'Failed to create project');
    } finally {
      setFormLoading(false);
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Projects Overview
          </CardTitle>
          <CardDescription>Manage and monitor all active projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Projects Overview
        </CardTitle>
        <CardDescription>Manage and monitor all active projects</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projects List
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Project
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Projects Table */}
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects found.</p>
                <Button 
                  onClick={() => setActiveTab('create')} 
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Project
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Manager
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project._id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{project.title}</div>
                            {project.details && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {project.details}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(project.budget)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(project.status)}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.managerId?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {project.managerId?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="max-w-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Project Title *
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Budget *
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      placeholder="Enter budget amount"
                      min="0"
                      step="1000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Project Details</Label>
                  <Textarea
                    id="details"
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder="Enter project description and details"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Deadline *
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="managerId" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Manager *
                    </Label>
                    <Select
                      value={form.managerId}
                      onValueChange={(value) => setForm({ ...form, managerId: value })}
                      disabled={managersLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager._id} value={manager._id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{manager.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {manager.email} {manager.dept && `• ${manager.dept}`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value: 'Ongoing' | 'Completed' | 'Delayed') => 
                      setForm({ ...form, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                {formSuccess && (
                  <Alert>
                    <AlertDescription>{formSuccess}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={formLoading}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {formLoading ? 'Creating...' : 'Create Project'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab('list')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}