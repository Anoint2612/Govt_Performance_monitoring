import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, FolderOpen } from "lucide-react";
import api from '../services/api';

interface Project {
  _id: string;
  title: string;
  status: 'Completed' | 'Delayed' | 'In Progress' | 'Pending';
  managerId?: {
    name: string;
  };
  deadline?: string;
}

export default function ProjectsOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get('/hq/projects');
        if (!cancelled) setProjects(res.data || []);
      } catch (e) {
        if (!cancelled) setError('Failed to load projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Delayed':
        return 'destructive';
      case 'In Progress':
        return 'secondary';
      default:
        return 'outline';
    }
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

  if (!projects.length) {
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
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No projects found.</p>
          </div>
        </CardContent>
      </Card>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Manager
              </TableHead>
              <TableHead className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Deadline
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(project.status)}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>{project.managerId?.name || '—'}</TableCell>
                <TableCell>
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
