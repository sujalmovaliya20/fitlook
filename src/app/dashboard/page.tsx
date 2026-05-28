import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Star } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        {/* Stat Card 1 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trials Today
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +4 from yesterday
            </p>
          </CardContent>
        </Card>

        {/* Stat Card 2 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trials This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">148</div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>

        {/* Stat Card 3 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Satisfaction
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8 ★</div>
            <p className="text-xs text-muted-foreground">
              Based on 89 reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 rounded-xl border bg-card text-card-foreground shadow-sm p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Ready for a new customer?</h3>
        <p className="text-sm text-muted-foreground mb-4">Start a new virtual trial to show them the magic.</p>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors">
          Start New Trial
        </button>
      </div>
    </div>
  );
}
