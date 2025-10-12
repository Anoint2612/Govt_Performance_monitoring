import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import api from '../services/api';
import { toast } from '@/hooks/use-toast';

interface Assignment { _id: string; taskHeading: string; taskDetails?: string; status?: string; endTime?: string; projectId?: any; createdAt?: string; updatedAt?: string }
interface Project { _id: string; title: string; details?: string; totalBudget?: number; spentBudget?: number; deadline?: string; managerId?: any; status?: string }

interface Props { onLogout: () => void }

export default function EmployeeDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState('projects');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [historyAssignments, setHistoryAssignments] = useState<Assignment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [ticketOpenFor, setTicketOpenFor] = useState<string | null>(null);
  const [ticketHeading, setTicketHeading] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [aRes, alRes, pRes] = await Promise.all([
          api.get('/employee/assignments'),
          api.get('/employee/alerts'),
          api.get('/employee/projects')
        ]);
        setAssignments(aRes.data || []);
        setAlerts(alRes.data || []);
        setProjects(pRes.data || []);
      } catch (err) {
        console.error('Failed to load employee data', err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (activeTab !== 'history') return;
    const fetchHistory = async () => {
      try {
        const res = await api.get('/employee/assignments/history');
        setHistoryAssignments(res.data || []);
      } catch (err) {
        console.error('Failed to load assignment history', err);
      }
    };
    fetchHistory();
  }, [activeTab]);

  async function refreshAssignments() {
    const res = await api.get('/employee/assignments');
    setAssignments(res.data || []);
  }

  async function toggleComplete(a: Assignment) {
    try {
      const newStatus = a.status === 'Completed' ? 'Pending' : 'Completed';
      await api.post(`/employee/assignments/${a._id}/update`, { status: newStatus });
      await refreshAssignments();
    } catch (err) {
      console.error('Failed to toggle', err);
      toast({ title: 'Error', description: 'Could not update assignment' });
    }
  }

  async function raiseTicketFor(a: Assignment) {
    setTicketOpenFor(a._id);
  }

  async function submitTicket(assignmentId: string) {
    try {
      await api.post(`/employee/assignments/${assignmentId}/ticket`, { heading: ticketHeading, details: ticketDetails });
      toast({ title: 'Ticket raised', description: 'The manager will be notified' });
      setTicketOpenFor(null); setTicketHeading(''); setTicketDetails('');
    } catch (err) {
      console.error('Failed to raise ticket', err);
      toast({ title: 'Error', description: 'Could not raise ticket' });
    }
  }

  const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
          <h2 className="text-lg font-semibold">My Projects & Assignments</h2>
          <p className="text-sm text-muted-foreground mt-2">Projects assigned to you and their assignments.</p>

          <div className="mt-4 space-y-6">
            {projects.map((proj) => (
              <div key={proj._id} className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{proj.title}</div>
                    <div className="text-sm text-muted-foreground">Manager: {proj.managerId?.name || '—'}</div>
                  </div>
                  <div className="text-sm">Status: {proj.status}</div>
                </div>

                <div className="mt-3 space-y-3">
                  {assignments.filter(a => a.projectId && a.projectId._id === proj._id).map(a => (
                    <div key={a._id} className="p-3 border rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{a.taskHeading}</div>
                          <div className="text-sm text-muted-foreground">{a.taskDetails}</div>
                          <div className="text-xs text-muted-foreground">Due: {new Date(a.endTime).toLocaleString()}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-sm">{a.status}</div>
                          <select aria-label={`status-${a._id}`} value={a.status || 'Pending'} onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              await api.post(`/employee/assignments/${a._id}/update`, { status: newStatus });
                              await refreshAssignments();
                            } catch (err) {
                              toast({ title: 'Error', description: 'Could not update status' });
                            }
                          }} className="border rounded p-1">
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed</option>
                          </select>
                          <Button size="sm" onClick={() => raiseTicketFor(a)}>Raise Ticket</Button>
                        </div>
                      </div>
                      {ticketOpenFor === a._id && (
                        <div className="mt-2 space-y-2">
                          <input placeholder="Ticket heading" value={ticketHeading} onChange={(e) => setTicketHeading(e.target.value)} className="w-full border rounded p-2" />
                          <textarea placeholder="Details" value={ticketDetails} onChange={(e) => setTicketDetails(e.target.value)} className="w-full border rounded p-2" />
                          <div className="flex gap-2">
                            <Button onClick={() => submitTicket(a._id)}>Submit Ticket</Button>
                            <Button variant="outline" onClick={() => setTicketOpenFor(null)}>Cancel</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
          </div>

          </TabsContent>

          <TabsContent value="alerts">
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
              <h2 className="text-lg font-semibold">Alerts</h2>
              <p className="text-sm text-muted-foreground mt-2">Alerts issued for your projects.</p>
              <ul className="mt-4 space-y-2">
                {alerts.map(al => <li key={al._id} className="p-3 border rounded">{al.type}: {al.message}</li>)}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
              <h2 className="text-lg font-semibold">Project Details</h2>
              <p className="text-sm text-muted-foreground mt-2">Overview and budget information.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(p => (
                  <div key={p._id} className="p-4 border rounded">
                    <h3 className="font-medium">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.details}</p>
                    <div className="mt-2 text-sm">Manager: {p.managerId?.name}</div>
                    <div className="mt-2 text-sm">Deadline: {new Date(p.deadline).toLocaleDateString()}</div>
                    <div className="mt-2">
                 <div className="text-sm">Total budget: {p.totalBudget ? fmt.format(p.totalBudget) : '-'}</div>
                 <div className="text-sm mt-1">Spent: {p.spentBudget ? fmt.format(p.spentBudget) : '-'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
              <h2 className="text-lg font-semibold">Assignment History</h2>
              <p className="text-sm text-muted-foreground mt-2">Verified assignments (audit trail).</p>
              <div className="mt-4 space-y-3">
                {historyAssignments.length === 0 && <p className="text-sm text-muted-foreground">No verified assignments</p>}
                {historyAssignments.map(h => (
                  <div key={h._id} className="p-3 border rounded">
                    <div className="font-medium">{h.taskHeading}</div>
                    <div className="text-sm text-muted-foreground">Project: {h.projectId?.title || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">Verified at: {new Date(h.updatedAt || h.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
