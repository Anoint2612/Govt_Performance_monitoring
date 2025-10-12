import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Mail, Lock, Building, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';

interface EmployeeForm {
  name: string;
  email: string;
  password: string;
  dept: string;
  level?: string;
}

export default function ManagerEmployeeForm() {
  const [form, setForm] = useState<EmployeeForm>({ name: '', email: '', password: '', dept: '', level: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register-employee', form);
      setStatus('Employee created successfully');
      setForm({ name: '', email: '', password: '', dept: '', level: '' });
    } catch (err) {
      setError('Failed to create employee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
      <h3 className="text-lg font-semibold mb-4">Register Employee</h3>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="emp_name" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Name
          </Label>
          <Input id="emp_name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div>
          <Label htmlFor="emp_email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input id="emp_email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>

        <div>
          <Label htmlFor="emp_password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </Label>
          <Input id="emp_password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>

        <div>
          <Label htmlFor="emp_dept" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Department
          </Label>
          <Input id="emp_dept" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Employee'}</Button>
        </div>

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
      </form>
    </div>
  );
}
