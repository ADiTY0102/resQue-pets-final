import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AdoptionRequest {
  id: string;
  pet: { name: string; breed: string; type: string; imageUrl: string };
  created_at: string;
  request_status: string;
  admin_comment?: string;
}

export const AdoptionRequests = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);

  useEffect(() => {
    // Simulate loading mock adoption requests
    setRequests([
      {
        id: '1',
        pet: {
          name: 'Max',
          breed: 'Golden Retriever',
          type: 'dog',
          imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24',
        },
        created_at: new Date().toISOString(),
        request_status: 'pending',
      },
    ]);
    setIsLoading(false);
  }, [userId]);

  if (isLoading) return <div>Loading your requests...</div>;
  if (!requests?.length) return <div className="text-muted-foreground">No adoption requests yet.</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pet</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admin Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request: any) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {request.pet?.image_url && (
                    <img
                      src={request.pet.image_url}
                      alt={request.pet.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{request.pet?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {request.pet?.breed} - {request.pet?.type}
                    </div>
                  </div>
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
              <TableCell>{request.admin_comment || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
