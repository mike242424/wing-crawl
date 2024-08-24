'use client';

import { useState, useEffect } from 'react';
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
import Spinner from '@/components/spinner';

const Signup = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    setLoading(true);
    try {
      await axios.post('/api/signup', { name: data.name });
      setIsSubmitted(true);
    } catch (error: any) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        setServerError(error.response.data.message);
      } else {
        setServerError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      window.location.href = '/dashboard';
    }
  }, [isSubmitted]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Name:</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ron Swanson"
                      {...field}
                      onChange={(e) => {
                        setServerError(null);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-primary text-sm mt-2">
                    {fieldState.error?.message || serverError}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-4"
            >
              Register
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex flex-col max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-10 space-y-4">
        <div className="flex flex-col">
          <p className="italic text-lg">&quot;The crawl is for all.&quot;</p>
          <p className="text-primary font-bold text-right">- Nick Miller</p>
        </div>
        <div className="flex flex-col">
          <p className="italic text-lg">
            &quot;I understand nothing about the wings we just ate except that
            they were delicious and I&apos;m probably going to eat 20
            more.&quot;
          </p>
          <p className="text-primary font-bold text-right">- Michael Scott</p>
        </div>
        <div className="flex flex-col">
          <p className="italic text-lg">
            &quot;Why would anyone ever eat anything besides breakfast food?
            People are idiots. Except for chicken wings. They get a pass.&quot;
          </p>
          <p className="text-primary font-bold text-right">- Leslie Knope</p>
        </div>
      </div>
    </>
  );
};

export default Signup;
