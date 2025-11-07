import {
  connect,
  disconnect,
  getFriends,
  getRelationshipsByUserId,
  updateRelationshipStatus,
} from "@/apis/relationship.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFriends = (userId: number) => {
  return useQuery({
    queryKey: ["friends", userId],
    queryFn: () => getFriends(userId),
  });
};
export const useRelationship = (userId: number) => {
  return useQuery({
    queryKey: ["relationship", userId],
    queryFn: () => getRelationshipsByUserId(userId),
  });
};
export const useCreateRelationship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      senderId,
      receiverId,
    }: {
      senderId: number;
      receiverId: number;
    }) => connect({ senderId, receiverId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });

      toast.success("Kết nối thành công!", { duration: 2000 });
    },
  });
};
export const useUpdateRelationshipStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: {
        receiverId: number;
        senderId: number;
      };
      status: "connected" | "rejected";
    }) => updateRelationshipStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};
export const useDeleteRelationship = () => {
  return useMutation({
    mutationFn: (id: { senderId: number; receiverId: number }) =>
      disconnect(id),
    onSuccess: () => {
      toast.success("Ngắt kết nối thành công!", { duration: 2000 });
    },
  });
};
