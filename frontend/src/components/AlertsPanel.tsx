import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import api from '../services/api';

interface AlertItem {
  _id: string;
  type: 'Delay' | 'TicketEscalation' | 'Completion' | 'Warning';
  message: string;
  createdAt: string;
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get('/hq/alerts');
        if (!cancelled) setAlerts(res.data || []);
      } catch (e) {
        if (!cancelled) setError('Failed to load alerts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Delay':
        return <Clock className="h-4 w-4" />;
      case 'TicketEscalation':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Completion':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'Delay':
        return 'destructive';
      case 'TicketEscalation':
        return 'default';
      case 'Completion':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts Panel
          </CardTitle>
          <CardDescription>Monitor system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
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

  if (!alerts.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts Panel
          </CardTitle>
          <CardDescription>Monitor system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No alerts at this time.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alerts Panel
        </CardTitle>
        <CardDescription>Monitor system alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert key={alert._id} variant={getAlertVariant(alert.type)}>
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getAlertVariant(alert.type)} className="text-xs">
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <AlertDescription>{alert.message}</AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
