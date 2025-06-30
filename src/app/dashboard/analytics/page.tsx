import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Users, Truck, AlertTriangle } from 'lucide-react';

const kpiData = [
    { title: "Active Missions", value: "12", change: "+2", icon: <Truck className="h-5 w-5 text-muted-foreground" />, changeColor: "" },
    { title: "Team Members", value: "245", change: "+15", icon: <Users className="h-5 w-5 text-muted-foreground" />, changeColor: "text-primary" },
    { title: "Critical Alerts", value: "3", change: "+1", icon: <AlertTriangle className="h-5 w-5 text-muted-foreground" />, changeColor: "text-destructive" },
];

const recentActivity = [
    { id: "M-1024", mission: "Flood Relief, District 7", status: "In Progress", team: "Alpha", date: "2024-07-21" },
    { id: "M-1023", mission: "Medical Camp, West Suburbs", status: "Completed", team: "Bravo", date: "2024-07-20" },
    { id: "M-1022", mission: "Food Distribution, North Valley", status: "Completed", team: "Alpha", date: "2024-07-19" },
    { id: "A-0045", mission: "New team member onboarded", status: "Info", team: "HR", date: "2024-07-19" },
    { id: "M-1021", mission: "Supply Run, Sector 4", status: "In Progress", team: "Charlie", date: "2024-07-18" },
];


export default function AnalyticsPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <ArrowUp className={`h-4 w-4 mr-1 ${kpi.changeColor}`} />
                {kpi.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>An overview of the latest missions and alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mission ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Team</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.id}</TableCell>
                  <TableCell>{activity.mission}</TableCell>
                  <TableCell>
                    <Badge variant={
                        activity.status === "Completed" ? "secondary" : 
                        activity.status === "In Progress" ? "default" :
                        "outline"
                    }>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.team}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
