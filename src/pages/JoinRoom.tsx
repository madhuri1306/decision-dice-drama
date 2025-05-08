
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db } from "@/services/mockDatabase";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";

const formSchema = z.object({
  roomCode: z.string()
    .min(6, { message: "Room code must be 6 characters." })
    .max(6, { message: "Room code must be 6 characters." })
    .toUpperCase()
});

type FormValues = z.infer<typeof formSchema>;

const JoinRoom: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomCode: ""
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const room = await db.joinRoom(values.roomCode);
      
      toast({
        title: "Room Joined!",
        description: `You've joined "${room.title}"`,
      });
      
      navigate(`/room/${room.id}`);
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
        <div className="container max-w-md mx-auto py-12 px-4">
          <div className="bg-white shadow-lg rounded-xl p-6 md:p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-game-primary">Join a Decision Room</h1>
              <p className="text-gray-600 mt-2">
                Enter a room code to join an existing decision
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="roomCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ABCD12" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          className="text-center text-lg font-mono uppercase"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="button-gradient w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Joining Room..." : "Join Room"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </MainLayout>
    </AuthLayout>
  );
};

export default JoinRoom;
