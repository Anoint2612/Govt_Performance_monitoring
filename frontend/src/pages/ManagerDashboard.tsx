import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManagerEmployeeForm from '../components/ManagerEmployeeForm';

interface Project { _id: string; title: string; status?: string; }
interface Emp { _id: string; name: string; email: string; dept?: string }
interface Assignment { _id: string; taskHeading: string; assignedTo?: Emp }

interface Props { onLogout: () => void }

export default function ManagerDashboard({ onLogout }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('register');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pRes, eRes, aRes, alRes] = await Promise.all([
          api.get('/manager/projects'),
          api.get('/manager/employees'),
          api.get('/manager/assignments'),
          api.get('/alerts')
        ]);
        setProjects(pRes.data || []);
        setEmployees(eRes.data || []);
        setAssignments(aRes.data || []);
        setAlerts(alRes.data || []);
      } catch (err) {
        console.error('Failed to load manager data', err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="bg-card border-b border-border/50 shadow-soft">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-elegant">
              <svg className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Manager Portal</h1>
              <p className="text-sm text-muted-foreground">Team management and employee registration</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="register">Register Employee</TabsTrigger>
            <TabsTrigger value="alerts">Send Alert</TabsTrigger>
            <TabsTrigger value="rating">Rate Employee</TabsTrigger>
            <TabsTrigger value="assign">Manage Project</TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ManagerEmployeeForm />
              </div>
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h2 className="text-lg font-semibold">Team Overview</h2>
                  <p className="text-sm text-muted-foreground mt-2">Quick view of your employees and ongoing assignments.</p>
                  <div className="mt-4">
                    <h4 className="font-medium">Employees</h4>
                    <ul className="mt-2 text-sm">
                      {employees.map(emp => <li key={emp._id}>{emp.name} — {emp.email}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h3 className="text-lg font-semibold">Send Alert</h3>
                  <ManagerAlertComposer />
                </div>
              </div>
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h3 className="text-lg font-semibold">Latest Alerts</h3>
                  <ul className="mt-2 text-sm">
                    {alerts.map(al => <li key={al._id}>{al.type}: {al.message}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rating">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h3 className="text-lg font-semibold">Rate Employee</h3>
                  <ManagerRatingForm employees={employees} />
                </div>
              </div>
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h3 className="text-lg font-semibold">Assignments</h3>
                  <ul className="mt-2 text-sm">
                    {assignments.map(a => <li key={a._id}>{a.taskHeading} — {a.assignedTo?.name || 'Unassigned'}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assign">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h3 className="text-lg font-semibold">Manage Project</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await api.post('/manager/projects/assign', { projectId: selectedProjectId, employeeId: selectedEmployeeId });
                      setSelectedEmployeeId('');
                      toast({ title: 'Assigned', description: 'Employee assigned to project' });
                    } catch (err: any) {
                      const msg = err?.response?.data?.message || 'Failed to assign';
                      toast({ title: 'Error', description: msg });
                    }
                  }} className="space-y-4 my-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Project</label>
                      <select title="project-select" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} required className="w-full border rounded p-2">
                        <option value="">Select project</option>
                        {projects.map((p: any) => <option key={p._id} value={p._id}>{p.title || p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employee</label>
                      <select title="employee-select" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} required className="w-full border rounded p-2">
                        <option value="">Select employee</option>
                        {employees.map((u: any) => <option key={u._id} value={u._id}>{u.name + ' — ' + u.email}</option>)}
                      </select>
                    </div>
                    <div>
                      <Button type="submit">Assign Employee</Button>
                    </div>
                  </form>

                  <div className="mt-6">
                    <h4 className="text-md font-medium">Create Assignment</h4>
                    <CreateAssignmentForm employees={employees} onCreated={() => {
                      // refresh assignments
                      api.get('/manager/assignments').then(r => setAssignments(r.data || []));
                    }} />
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h3 className="text-lg font-semibold">Recent Assignments</h3>
                  <ul className="mt-2 text-sm">
                    {assignments.map(a => <li key={a._id}>{a.taskHeading} — {a.assignedTo?.name || 'Unassigned'}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ManagerAlertComposer() {
  const [type, setType] = useState('Delay');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    try {
                    await api.post('/manager/alerts', { type, message });
      setMessage('');
      toast({ title: 'Alert sent', description: 'Alert was created successfully' });
    } catch (err) {
      console.error(err);
  toast({ title: 'Send failed', description: 'Failed to create alert' });
    } finally { setLoading(false); }
  }

  return (
    <div className="mt-2 space-y-2">
      <select aria-label="alert-type" value={type} onChange={(e) => setType(e.target.value)} className="border rounded px-2">
        <option value="Delay">Delay</option>
        <option value="Performance">Performance</option>
        <option value="TicketEscalation">TicketEscalation</option>
      </select>
      <textarea placeholder="Alert message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-2 border rounded" />
      <Button onClick={send} disabled={loading}>{loading ? 'Sending...' : 'Send Alert'}</Button>
    </div>
  );
}

function ManagerRatingForm({ employees }: { employees: any[] }) {
  const [employeeId, setEmployeeId] = useState('');
  const [score, setScore] = useState(5);
  const [notes, setNotes] = useState('');

  async function submit() {
    try {
      await api.post('/manager/ratings', { employeeId, score, notes });
      setNotes('');
  toast({ title: 'Rating saved', description: 'Employee rated' });
    } catch (err) {
      console.error(err);
  toast({ title: 'Save failed', description: 'Failed to save rating' });
    }
  }

  return (
    <div className="mt-2 space-y-2">
      <select aria-label="select-employee" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="border rounded px-2">
        <option value="">Select employee</option>
        {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
      </select>
      <div className="flex gap-2">
        <input title="rating" placeholder="score 1-5" type="number" min={1} max={5} value={score} onChange={(e) => setScore(Number(e.target.value))} className="border rounded px-2" />
        <Button onClick={submit}>Save Rating</Button>
      </div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" className="w-full p-2 border rounded" />
    </div>
  );
}

function CreateAssignmentForm({ employees, onCreated }: { employees: any[]; onCreated?: () => void }) {
  const [taskHeading, setTaskHeading] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      await api.post('/manager/assignments', { taskHeading, taskDetails, assignedTo, startTime, endTime });
      toast({ title: 'Assignment created', description: 'Assignment was created successfully' });
      setTaskHeading(''); setTaskDetails(''); setAssignedTo(''); setStartTime(''); setEndTime('');
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed', description: 'Could not create assignment' });
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-3">
      <input placeholder="Task heading" value={taskHeading} onChange={(e) => setTaskHeading(e.target.value)} className="w-full border rounded p-2" />
      <textarea placeholder="Details" value={taskDetails} onChange={(e) => setTaskDetails(e.target.value)} className="w-full border rounded p-2" />
      <select aria-label="assign-to" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full border rounded p-2">
        <option value="">Assign to (optional)</option>
        {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
      </select>
      <div className="flex gap-2">
  <input title="start-time" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border rounded p-2" />
  <input title="end-time" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border rounded p-2" />
      </div>
      <div>
        <Button onClick={submit} disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
      </div>
    </div>
  );
}

