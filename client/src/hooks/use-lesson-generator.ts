import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function useLessonGenerator() {
  const queryClient = useQueryClient();

  const lessonsQuery = useQuery({
    queryKey: ["/api/lessons"],
    queryFn: () => apiRequest("/api/lessons"),
  });

  const generateLessonMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/lessons/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
    },
  });

  const uploadCurriculumMutation = useMutation({
    mutationFn: (formData: FormData) => apiRequest("/api/upload/curriculum", {
      method: "POST",
      body: formData,
    }),
  });

  return {
    lessonsQuery,
    generateLessonMutation,
    uploadCurriculumMutation,
  };
}