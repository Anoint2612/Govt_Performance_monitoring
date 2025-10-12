import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Filter, Users, Building, TrendingUp } from "lucide-react";
import api from '../services/api';

interface PerformanceCriteria {
  minScore: number;
  maxScore: number;
}

interface Employee {
  _id: string;
  name: string;
  dept?: string;
  level?: string;
}

export default function PerformanceAnalytics() {
  const [criteria, setCriteria] = useState<PerformanceCriteria>({ 
    minScore: 0, 
    maxScore: 100 
  });
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/hq/performance?minScore=${criteria.minScore}&maxScore=${criteria.maxScore}`);
      setData(res.data.employees || []);
    } catch (e) {
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Analytics
        </CardTitle>
        <CardDescription>Analyze employee performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Filter Controls */}
          <div className="flex items-end gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="minScore" className="text-sm">Min Score</Label>
              <Input
                id="minScore"
                type="number"
                value={criteria.minScore}
                onChange={(e) => setCriteria({ ...criteria, minScore: Number(e.target.value) })}
                className="w-32"
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxScore" className="text-sm">Max Score</Label>
              <Input
                id="maxScore"
                type="number"
                value={criteria.maxScore}
                onChange={(e) => setCriteria({ ...criteria, maxScore: Number(e.target.value) })}
                className="w-32"
                min="0"
                max="100"
              />
            </div>
            <Button onClick={load} disabled={loading} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                <Badge variant="destructive" className="mr-2">Error</Badge>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Data Table */}
          {!loading && !error && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Showing {data.length} employees
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Name
                    </TableHead>
                    <TableHead className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Department
                    </TableHead>
                    <TableHead className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Level
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.dept || '—'}</TableCell>
                      <TableCell>
                        {employee.level ? (
                          <Badge variant="outline">{employee.level}</Badge>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No performance data found for the selected criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
