import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface AdoptionRequest {
  id: string;
  user: { full_name: string; email: string; phone: string };
  pet: { name: string; breed: string; type: string };
  request_status: string;
  created_at: string;
}

export const AdoptionsManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);

  useEffect(() => {
    // Simulate loading mock adoption requests
    setRequests([
      {
        id: '1',
        user: { full_name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
        pet: { name: 'Max', breed: 'Golden Retriever', type: 'dog' },
        request_status: 'pending',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        user: { full_name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321' },
        pet: { name: 'Luna', breed: 'Persian', type: 'cat' },
        request_status: 'approved',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
    setIsLoading(false);
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      setRequests(requests.map(req => 
        req.id === id ? { ...req, request_status: status } : req
      ));
      toast({
        title: "Adoption request updated",
        description: `Status changed to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading adoption requests...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Pet</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request: any) => (
            <TableRow key={request.id}>
              <TableCell>{request.user?.full_name}</TableCell>
              <TableCell>
                {request.pet?.name} ({request.pet?.breed})
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{request.user?.email}</div>
                  <div className="text-muted-foreground">{request.user?.phone}</div>
                </div>
              </TableCell>
              <TableCell>{format(new Date(request.created_at), "PPP")}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.request_status === "approved"
                      ? "default"
                      : request.request_status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {request.request_status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleStatusUpdate(request.id, "approved")
                    }
                    disabled={request.request_status === "approved"}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleStatusUpdate(request.id, "rejected")
                    }
                    disabled={request.request_status === "rejected"}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
// updated