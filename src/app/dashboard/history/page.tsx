import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const mockTrials = [
  {
    id: "TRL-001",
    customer: "Priya Sharma",
    fabric: "Banarasi Silk",
    garment: "Saree",
    date: "2024-05-28",
    status: "Generated",
  },
  {
    id: "TRL-002",
    customer: "Anjali Desai",
    fabric: "Georgette",
    garment: "Lehenga",
    date: "2024-05-28",
    status: "Generated",
  },
  {
    id: "TRL-003",
    customer: "Kavita Rao",
    fabric: "Cotton Silk",
    garment: "Salwar Suit",
    date: "2024-05-27",
    status: "Pending",
  },
  {
    id: "TRL-004",
    customer: "Sneha Patel",
    fabric: "Kanjeevaram",
    garment: "Saree",
    date: "2024-05-26",
    status: "Generated",
  },
  {
    id: "TRL-005",
    customer: "Ritu Singh",
    fabric: "Chiffon",
    garment: "Gown",
    date: "2024-05-25",
    status: "Generated",
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Trial History</h1>
      <p className="text-muted-foreground">View and manage past customer virtual trials.</p>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Fabric Type</TableHead>
              <TableHead>Garment Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTrials.map((trial) => (
              <TableRow key={trial.id}>
                <TableCell className="font-medium">{trial.customer}</TableCell>
                <TableCell>{trial.fabric}</TableCell>
                <TableCell>{trial.garment}</TableCell>
                <TableCell>{trial.date}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      trial.status === "Generated"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {trial.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
