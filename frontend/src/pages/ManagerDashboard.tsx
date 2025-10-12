import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, User, FolderOpen, Users, Building, Calendar } from 'lucide-react';
import ManagerEmployeeForm from '../components/ManagerEmployeeForm';

interface Project { 
  _id: string; 
  title: string; 
  status?: string; 
  budget?: number;
  deadline?: string;
  assignedEmployees?: Emp[];
}
interface Emp { _id: string; name: string; email: string; dept?: string; level?: string }
interface Assignment { _id: string; taskHeading: string; taskDetails?: string; status?: string; endTime?: string; assignedTo?: Emp; projectId?: any }
interface Ticket { 
  _id: string; 
  employeeId: { _id: string; name: string; email: string };
  heading: string; 
  details: string; 
  status: 'Resolved' | 'Escalated';
  startTime?: string;
  endTime?: string;
  resolutionNotes?: string;
}

interface Props { onLogout: () => void }

export default function ManagerDashboard({ onLogout }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentFilter, setAssignmentFilter] = useState('');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState('register');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const assignmentsPath = '/manager/assignments' + (assignmentFilter ? `?status=${assignmentFilter}` : '');
        const [pRes, eRes, aRes, alRes, tRes] = await Promise.all([
          api.get('/manager/projects'),
          api.get('/manager/employees'),
          api.get(assignmentsPath),
          api.get('/alerts'),
          api.get('/manager/tickets')
        ]);
        setProjects(pRes.data || []);
        setEmployees(eRes.data || []);
        setAssignments(aRes.data || []);
        setAlerts(alRes.data || []);
        setTickets(tRes.data || []);
      } catch (err) {
        console.error('Failed to load manager data', err);
      }
    };
    fetch();
  }, [assignmentFilter]);

  const handleTicketAction = async (ticketId: string, action: 'Resolved' | 'Escalated') => {
    try {
      await api.post(`/manager/tickets/${ticketId}/${action.toLowerCase()}`);
      // Refresh tickets
      const tRes = await api.get('/manager/tickets');
      setTickets(tRes.data || []);
      toast({ 
        title: 'Success', 
        description: `Ticket ${action.toLowerCase()} successfully` 
      });
    } catch (err) {
      console.error('Failed to update ticket', err);
      toast({ 
        title: 'Error', 
        description: `Failed to ${action.toLowerCase()} ticket` 
      });
    }
  };

  const handleVerify = async (assignmentId: string) => {
    try {
      await api.post(`/manager/assignments/${assignmentId}/verify`);
      // refresh assignments with current filter
      const path = '/manager/assignments' + (assignmentFilter ? `?status=${assignmentFilter}` : '');
      const res = await api.get(path);
      setAssignments(res.data || []);
      toast({ title: 'Verified', description: 'Assignment marked as Verified' });
    } catch (err) {
      console.error('Failed to verify assignment', err);
      toast({ title: 'Error', description: 'Could not verify assignment' });
    }
  };

    const updateStatus = async (assignmentId: string, status: string) => {
      try {
        await api.post(`/manager/assignments/${assignmentId}/status`, { status });
        // refresh
        const path = '/manager/assignments' + (assignmentFilter ? `?status=${assignmentFilter}` : '');
        const res = await api.get(path);
        setAssignments(res.data || []);
        toast({ title: 'Updated', description: `Assignment marked ${status}` });
      } catch (err) {
        console.error('Failed to update status', err);
        toast({ title: 'Error', description: 'Could not update assignment status' });
      }
    };

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
            <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="register">Manage Employee</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="assign">Manage Project</TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ManagerEmployeeForm />
                <ManagerRatingForm employees={employees} />
              </div>
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h2 className="text-lg font-semibold">Team Overview</h2>
                  <p className="text-sm text-muted-foreground mt-2">Projects and employee assignments</p>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-3">
                        <FolderOpen className="h-4 w-4" />
                        Projects
                      </h4>
                      <div className="space-y-3">
                        {projects.map(project => (
                          <Card key={project._id} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{project.title}</h5>
                              <Badge variant={project.status === 'Ongoing' ? 'secondary' : project.status === 'Completed' ? 'default' : 'destructive'}>
                                {project.status || 'Unknown'}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-3">
                              {project.budget && `Budget: $${project.budget.toLocaleString()}`}
                              {project.deadline && ` • Deadline: ${new Date(project.deadline).toLocaleDateString()}`}
                            </div>
                            <div>
                              <Label className="text-xs font-medium">Assigned Employees:</Label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                  {employees.map(emp => (
                                    <SelectItem key={emp._id} value={emp._id}>
                                      <div className="flex items-center gap-2">
                                        <User className="h-3 w-3" />
                                        {emp.name} ({emp.email})
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </Card>
                        ))}
                        {projects.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">No projects assigned</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4" />
                        Team Members
                      </h4>
                      <div className="space-y-2">
                        {employees.map(emp => (
                          <div key={emp._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{emp.name}</p>
                                <p className="text-xs text-muted-foreground">{emp.email}</p>
                              </div>
                            </div>
                            {emp.dept && (
                              <Badge variant="outline" className="text-xs">
                                <Building className="h-3 w-3 mr-1" />
                                {emp.dept}
                              </Badge>
                            )}
                          </div>
                        ))}
                        {employees.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">No team members</p>
                        )}
                      </div>
                    </div>
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
                  <ManagerAlertComposer projects={projects} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h3 className="text-lg font-semibold">Latest Alerts</h3>
                  <div className="mt-4 space-y-3">
                    {alerts.map(al => (
                      <div key={al._id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant={al.type === 'Delay' ? 'destructive' : al.type === 'Performance' ? 'default' : 'secondary'}>
                            {al.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(al.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{al.message}</p>
                      </div>
                    ))}
                    {alerts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No alerts found</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                  <h3 className="text-lg font-semibold">Latest Tickets</h3>
                  <div className="mt-4 space-y-3">
                    {tickets.map(ticket => (
                      <div key={ticket._id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{ticket.heading}</h4>
                          <Badge variant={ticket.status === 'Resolved' ? 'default' : ticket.status === 'Escalated' ? 'destructive' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{ticket.details}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">From:</span> {ticket.employeeId?.name || 'Unknown'} ({ticket.employeeId?.email || 'No email'})
                          </div>
                          <div className="flex gap-2">
                            {ticket.status === 'Escalated' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleTicketAction(ticket._id, 'Resolved')}
                                  className="text-xs h-7"
                                >
                                  Resolve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleTicketAction(ticket._id, 'Escalated')}
                                  className="text-xs h-7"
                                >
                                  Escalate
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {tickets.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No tickets found</p>
                    )}
                  </div>
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
                    <CreateAssignmentForm employees={employees} projects={projects} onCreated={() => {
                      // refresh assignments
                      api.get('/manager/assignments').then(r => setAssignments(r.data || []));
                    }} />
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Recent Assignments</h3>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">Filter:</label>
                        <select aria-label="assignment-filter" value={assignmentFilter} onChange={(e) => setAssignmentFilter(e.target.value)} className="border rounded p-1">
                          <option value="">All</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Verified">Verified</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-2 text-sm space-y-2">
                      {assignments.length === 0 && <p className="text-sm text-muted-foreground">No assignments found</p>}
                      {assignments.map(a => (
                        <div key={a._id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium">{a.taskHeading}</div>
                            <div className="text-xs text-muted-foreground">{a.assignedTo?.name || 'Unassigned'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">{a.status}</div>
                            {a.status === 'Pending' && (
                              <Button size="sm" onClick={() => updateStatus(a._id, 'Completed')} aria-label={`complete-${a._id}`}>Complete</Button>
                            )}
                            {a.status === 'Completed' && (
                              <>
                                <Button size="sm" onClick={() => updateStatus(a._id, 'Pending')} aria-label={`mark-pending-${a._id}`}>Mark Pending</Button>
                                <Button size="sm" onClick={() => handleVerify(a._id)}>Verify</Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ManagerAlertComposer({ projects }: { projects: Project[] }) {
  const [type, setType] = useState('Delay');
  const [projectId, setProjectId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!projectId) {
      toast({ title: 'Error', description: 'Please select a project' });
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/manager/alerts', { type, projectId, message });
      setMessage('');
      setProjectId('');
      toast({ title: 'Alert sent', description: 'Alert was created successfully' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Send failed', description: 'Failed to create alert' });
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <div className="mt-2 space-y-4">
      <div>
        <Label htmlFor="alert-type" className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Alert Type
        </Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Delay">Delay</SelectItem>
            <SelectItem value="Performance">Performance</SelectItem>
            <SelectItem value="TicketEscalation">Ticket Escalation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="alert-project" className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Select Project
        </Label>
        <Select value={projectId} onValueChange={setProjectId} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map(project => (
              <SelectItem key={project._id} value={project._id}>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-3 w-3" />
                  {project.title}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="alert-message">Alert Message</Label>
        <Textarea 
          id="alert-message"
          placeholder="Enter alert message..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          rows={4}
          required
        />
      </div>

      <Button onClick={send} disabled={loading || !projectId || !message} className="w-full">
        {loading ? 'Sending...' : 'Send Alert'}
      </Button>
    </div>
  );
}

function ManagerRatingForm({ employees }: { employees: any[] }) {
  const [employeeId, setEmployeeId] = useState('');
  const [score, setScore] = useState(5);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!employeeId) {
      toast({ title: 'Error', description: 'Please select an employee' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/manager/ratings', { employeeId, score, notes });
      setNotes('');
      setEmployeeId('');
      setScore(5);
      toast({ title: 'Rating saved', description: 'Employee rated successfully' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Save failed', description: 'Failed to save rating' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Rate Employee
        </CardTitle>
        <CardDescription>Evaluate employee performance and provide feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="rating-employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Select Employee
            </Label>
            <Select value={employeeId} onValueChange={setEmployeeId} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee to rate" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp._id} value={emp._id}>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      {emp.name} ({emp.email})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="rating-score" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Rating (1-5)
            </Label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`rate-${star}`}
                  onClick={() => setScore(star)}
                  className={`p-1 rounded ${
                    star <= score ? 'text-yellow-500' : 'text-gray-300'
                  } hover:text-yellow-500 transition-colors`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {score} out of 5
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="rating-notes">Performance Notes</Label>
            <Textarea
              id="rating-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide detailed feedback about the employee's performance..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !employeeId}>
            {loading ? 'Saving...' : 'Save Rating'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CreateAssignmentForm({ employees, projects, onCreated }: { employees: any[]; projects: Project[]; onCreated?: () => void }) {
  const [taskHeading, setTaskHeading] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);

  // Fetch project members when project is selected
  useEffect(() => {
    if (selectedProjectId) {
      api.get(`/manager/projects/${selectedProjectId}/members`)
        .then(res => setProjectMembers(res.data || []))
        .catch(err => {
          console.error('Failed to fetch project members:', err);
          setProjectMembers([]);
        });
    } else {
      setProjectMembers([]);
    }
  }, [selectedProjectId]);

  async function submit() {
    setLoading(true);
    try {
      await api.post('/manager/assignments', { 
        taskHeading, 
        taskDetails, 
        assignedTo, 
        projectId: selectedProjectId,
        endTime 
      });
      toast({ title: 'Assignment created', description: 'Assignment was created successfully' });
      setTaskHeading(''); 
      setTaskDetails(''); 
      setSelectedProjectId('');
      setAssignedTo(''); 
      setEndTime('');
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed', description: 'Could not create assignment' });
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="task-heading" className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Task Heading
        </Label>
        <Input 
          id="task-heading"
          placeholder="Enter task heading" 
          value={taskHeading} 
          onChange={(e) => setTaskHeading(e.target.value)} 
          required
        />
      </div>

      <div>
        <Label htmlFor="task-details">Task Details</Label>
        <Textarea 
          id="task-details"
          placeholder="Enter task details" 
          value={taskDetails} 
          onChange={(e) => setTaskDetails(e.target.value)} 
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="select-project" className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Select Project
        </Label>
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map(project => (
              <SelectItem key={project._id} value={project._id}>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-3 w-3" />
                  {project.title}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="assign-to" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Assign To
        </Label>
        <Select value={assignedTo} onValueChange={setAssignedTo}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee (optional)" />
          </SelectTrigger>
          <SelectContent>
            {projectMembers.length > 0 ? (
              projectMembers.map(member => (
                <SelectItem key={member.employeeId._id} value={member.employeeId._id}>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    {member.employeeId?.name || 'Unknown'} ({member.employeeId?.email || 'No email'})
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-employees" disabled>
                {selectedProjectId ? 'No employees assigned to this project' : 'Select a project first'}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="due-date" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Due Date
        </Label>
        <Input 
          id="due-date"
          type="datetime-local" 
          value={endTime} 
          onChange={(e) => setEndTime(e.target.value)} 
          className="w-full"
        />
      </div>

      <div>
        <Button onClick={submit} disabled={loading || !selectedProjectId} className="w-full">
          {loading ? 'Creating...' : 'Create Assignment'}
        </Button>
      </div>
    </div>
  );
}

