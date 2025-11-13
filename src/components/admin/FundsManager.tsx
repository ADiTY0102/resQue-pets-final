import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface Transaction {
  id: string;
  donor_name: string;
  utr_id: string;
  amount: number;
  transaction_time: string;
}

export const FundsManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Simulate loading mock transactions
    setTransactions([
      {
        id: '1',
        donor_name: 'John Doe',
        utr_id: 'UTR123456789',
        amount: 5000,
        transaction_time: new Date().toISOString(),
      },
      {
        id: '2',
        donor_name: 'Jane Smith',
        utr_id: 'UTR987654321',
        amount: 2500,
        transaction_time: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
    setIsLoading(false);
  }, []);

  const totalFunds = transactions.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Funds Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalFunds.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pets Adopted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor Name</TableHead>
              <TableHead>UTR ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.donor_name}</TableCell>
                <TableCell className="font-mono text-sm">{transaction.utr_id}</TableCell>
                <TableCell className="font-semibold">₹{Number(transaction.amount).toFixed(2)}</TableCell>
                <TableCell>{format(new Date(transaction.transaction_time), "PPp")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
