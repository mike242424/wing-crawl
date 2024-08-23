'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { SignupFormData } from '@/types/SignupFormDataType';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/validation/signupSchema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const Signup = () => {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
    },
  });
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    try {
      await axios.post('/api/signup', { name: data.name });

      window.location.reload();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Sign Up
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Name:</FormLabel>
                <FormControl>
                  <Input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="D. B. Cooper"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Signup;
