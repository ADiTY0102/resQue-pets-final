import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  roles: string[];
}

export const UsersManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Simulate loading mock users
    setUsers([
      {
        id: '1',
        user_id: 'user1',
        full_name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        roles: ['user'],
      },
      {
        id: '2',
        user_id: 'user2',
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        roles: ['admin'],
      },
      {
        id: '3',
        user_id: 'user3',
        full_name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+5555555555',
        roles: ['user'],
      },
    ]);
    setIsLoading(false);
  }, []);

  const handleToggleAdmin = (userId: string, isAdmin: boolean) => {
    try {
      setUsers(users.map(user =>
        user.user_id === userId
          ? {
              ...user,
              roles: isAdmin
                ? user.roles.filter(r => r !== 'admin')
                : [...user.roles, 'admin']
            }
          : user
      ));
      toast({
        title: "Role updated successfully",
        description: isAdmin ? "Admin role removed" : "Admin role added",
      });
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || "N/A"}</TableCell>
              <TableCell>
                {user.roles.includes("admin") ? (
                  <Badge variant="default">Admin</Badge>
                ) : (
                  <Badge variant="secondary">User</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleToggleAdmin(user.user_id, user.roles.includes("admin"))
                  }
                >
                  {user.roles.includes("admin") ? "Remove Admin" : "Make Admin"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
