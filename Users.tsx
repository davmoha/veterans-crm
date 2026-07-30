import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Shield, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Users() {
  const { user } = useAuth();
  const { data: users, isLoading, refetch } = trpc.users.list.useQuery();
  const updateRoleMutation = trpc.users.updateRole.useMutation();
  const deleteMutation = trpc.users.delete.useMutation();
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Only admins can manage users.</p>
        </div>
      </div>
    );
  }

  const handleToggleRole = (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    updateRoleMutation.mutate(
      { userId, role: newRole as "user" | "admin" },
      {
        onSuccess: () => {
          toast.success(`User role updated to ${newRole}`);
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update role");
        },
      }
    );
  };

  const handleDelete = (userId: number) => {
    deleteMutation.mutate(
      { userId },
      {
        onSuccess: () => {
          toast.success("User deleted successfully");
          setDeleteConfirm(null);
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete user");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage team members and their roles</p>
      </div>

      <Card className="bg-card border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Last Signed In</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{u.name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{u.email || "—"}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge
                      variant={u.role === "admin" ? "default" : "secondary"}
                      className={u.role === "admin" ? "bg-teal-600 text-white" : ""}
                    >
                      {u.role === "admin" ? (
                        <Shield className="w-3 h-3 mr-1 inline" />
                      ) : (
                        <User className="w-3 h-3 mr-1 inline" />
                      )}
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={u.role === "admin" ? "outline" : "default"}
                        onClick={() => handleToggleRole(u.id, u.role)}
                        disabled={u.id === user.id || updateRoleMutation.isPending}
                        className={u.role === "admin" ? "text-teal-600 border-teal-600 hover:bg-teal-50" : ""}
                      >
                        {updateRoleMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : u.role === "admin" ? (
                          "Demote"
                        ) : (
                          "Promote"
                        )}
                      </Button>
                      {u.id !== user.id && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteConfirm(u.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {users && users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}

      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
