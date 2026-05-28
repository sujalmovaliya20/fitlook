import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { HistoryFilters } from "./filters";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in</div>;
  }

  let query = supabase
    .from("trials")
    .select("*")
    .eq("shop_id", user.id)
    .order("created_at", { ascending: false });

  if (searchParams.search) {
    query = query.ilike("customer_name", `%${searchParams.search}%`);
  }

  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status);
  }

  const { data: trials, error } = await query;

  if (error) {
    console.error("Error fetching trials:", error);
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Trial History</h1>
          <p className="text-muted-foreground">View and manage past customer virtual trials.</p>
        </div>
        <Link href="/dashboard/new-trial">
          <Button>Start New Trial</Button>
        </Link>
      </div>

      <HistoryFilters />
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Fabric Type</TableHead>
              <TableHead>Garment Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trials && trials.length > 0 ? (
              trials.map((trial) => (
                <TableRow key={trial.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                    {trial.fabric_image_url ? (
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-muted border">
                        <img 
                          src={trial.fabric_image_url} 
                          alt="Fabric" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted border flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No img</span>
                      </div>
                    )}
                    {trial.customer_name}
                  </TableCell>
                  <TableCell>{trial.fabric_type || "N/A"}</TableCell>
                  <TableCell className="capitalize">{trial.garment_type}</TableCell>
                  <TableCell>{new Date(trial.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(trial.status)}`}
                    >
                      {trial.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-muted-foreground">No trials yet.</p>
                    <Link href="/dashboard/new-trial" className="text-primary hover:underline text-sm font-medium">
                      Start your first trial &rarr;
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
