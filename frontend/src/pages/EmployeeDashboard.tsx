import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import api from '../services/api';

interface Assignment { _id: string; taskHeading: string; taskDetails?: string; status?: string }

interface Props { onLogout: () => void }

export default function EmployeeDashboard({ onLogout }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [aRes, alRes] = await Promise.all([
          api.get('/employee/assignments'),
          api.get('/alerts')
        ]);
        setAssignments(aRes.data || []);
        setAlerts(alRes.data || []);
      } catch (err) {
        console.error('Failed to load employee data', err);
      }
    };
    fetch();
  }, []);

  async function submitUpdate(id: string, text: string, status?: string) {
    try {
      await api.post(`/employee/assignments/${id}/update`, { text, status });
      // refresh assignments
      const res = await api.get('/employee/assignments');
      setAssignments(res.data || []);
    } catch (err) {
      console.error('Failed to update assignment', err);
    }
  }
  
  function AssignmentUpdater({ assignment, onSubmit }: { assignment: Assignment; onSubmit: (id: string, text: string, status?: string) => void }) {
    const [text, setText] = useState('');
    const [status, setStatus] = useState('');
    return (
      <div className="mt-3 space-y-2">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Update details" className="w-full p-2 border rounded" />
        <div className="flex gap-2">
          <select aria-label="assignment-status" value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-2">
            <option value="">Set status (optional)</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
          <Button onClick={() => onSubmit(assignment._id, text, status)}>{'Send Update'}</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="bg-card border-b border-border/50 shadow-soft">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-elegant">
              <svg className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Employee Portal</h1>
              <p className="text-sm text-muted-foreground">View your assignments and submit reports</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
          <h2 className="text-lg font-semibold">My Assignments</h2>
          <p className="text-sm text-muted-foreground mt-2">Assigned projects and quick actions will appear here.</p>

          <div className="mt-4 space-y-4">
            {assignments.map((a) => (
              <div key={a._id} className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.taskHeading}</div>
                    <div className="text-sm text-muted-foreground">{a.taskDetails}</div>
                  </div>
                  <div className="text-sm">{a.status}</div>
                </div>
                <AssignmentUpdater assignment={a} onSubmit={submitUpdate} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
