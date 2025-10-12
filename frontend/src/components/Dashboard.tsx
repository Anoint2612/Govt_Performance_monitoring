import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import api from '../services/api';

interface Project {
  _id: string;
  title: string;
  status: 'Completed' | 'Delayed' | 'In Progress' | 'Pending';
}

interface AlertItem {
  _id: string;
  type: 'Delay' | 'Warning' | 'Info';
  message: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, a] = await Promise.all([
          api.get('/hq/projects'),
          api.get('/hq/alerts')
        ]);
        setProjects(p.data);
        setAlerts(a.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'Delay':
        return 'destructive';
      case 'Warning':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest project updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Alerts</CardTitle>
            <CardDescription>System notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Latest project updates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.slice(0, 6).map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Alerts</CardTitle>
          <CardDescription>System notifications and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.slice(0, 8).map((alert) => (
              <Alert key={alert._id} variant={getAlertVariant(alert.type)}>
                <AlertDescription className="flex items-center gap-2">
                  <Badge variant={getAlertVariant(alert.type)} className="text-xs">
                    {alert.type}
                  </Badge>
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
