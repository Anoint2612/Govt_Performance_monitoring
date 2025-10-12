import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Mail, Lock, Building, CheckCircle, AlertTriangle } from "lucide-react";
import api from '../services/api';

interface ManagerForm {
  name: string;
  email: string;
  password: string;
  dept: string;
}

export default function ManagerManagement() {
  const [form, setForm] = useState<ManagerForm>({ 
    name: '', 
    email: '', 
    password: '', 
    dept: '' 
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');
    setError('');
    setLoading(true);
    
    try {
      await api.post('/auth/register-manager', form);
      setStatus('Manager created successfully');
      setForm({ name: '', email: '', password: '', dept: '' });
    } catch (e) {
      setError('Failed to create manager');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Manager Management
        </CardTitle>
        <CardDescription>Add new managers to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
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
  );
}
