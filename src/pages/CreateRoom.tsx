
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/services/mockDatabase";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(50, {
    message: "Title cannot exceed 50 characters.",
  }),
  description: z.string().optional(),
  maxParticipants: z.string()
    .optional()
    .refine(
      (val) => !val || (Number(val) >= 2 && Number(val) <= 20),
      { message: "Participants must be between 2 and 20." }
    )
});

type FormValues = z.infer<typeof formSchema>;

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      maxParticipants: "10"
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const maxParticipants = values.maxParticipants 
        ? parseInt(values.maxParticipants) 
        : undefined;
        
      const newRoom = await db.createRoom({
        title: values.title,
        description: values.description || undefined,
        maxParticipants,
      });
      
      toast({
        title: "Room Created!",
        description: `Your room code is ${newRoom.code}`,
      });
      
      navigate(`/room/${newRoom.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout requiredAuth>
      <MainLayout>
        <div className="container max-w-2xl mx-auto py-12 px-4">
          <div className="bg-white shadow-lg rounded-xl p-6 md:p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-game-primary">Create a Decision Room</h1>
              <p className="text-gray-600 mt-2">
                Set up a new room for your group to make a decision
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Where should we eat tonight?" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear title for the decision to be made.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any details about this decision..." 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Additional context to help participants understand the decision.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Participants (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min={2}
                          max={20}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Limit the number of people who can join (2-20).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="button-gradient"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Room..." : "Create Decision Room"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </MainLayout>
    </AuthLayout>
  );
};

export default CreateRoom;
