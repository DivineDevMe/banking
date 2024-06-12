"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { authFormSchema } from "@/lib/utils";
import { z } from "zod";
import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      //sign up with Appwrite & create a palid link token
      setIsLoading(true);

      if (type === "sign-up") {
        const newUser = await signUp(values);
        setUser(newUser);
      }
      if (type === "sign-in") {
        const res = await signIn({
          email: values.email,
          password: values.password,
        });
        if (res) router.push("/");
      }
      console.log(values);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link
          href="/"
          className="flex  cursor-pointer 
        items-center gap-1"
        >
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* PlaidLink */}</div>
      ) : (
        <>
          {" "}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      name="firstName"
                      placeholder="Enter your first name"
                      control={form.control}
                      label="firstName"
                    />
                    <CustomInput
                      name="lastName"
                      placeholder="Enter your last name"
                      control={form.control}
                      label="lastName"
                    />
                  </div>
                  <CustomInput
                    name="address"
                    placeholder="Enter your specific address"
                    control={form.control}
                    label="Address"
                  />
                  <CustomInput
                    name="city"
                    placeholder="Enter your city"
                    control={form.control}
                    label="City"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      name="state"
                      placeholder="Example: NY"
                      control={form.control}
                      label="State"
                    />
                    <CustomInput
                      name="postalCode"
                      placeholder="Example: 11101"
                      control={form.control}
                      label="Postal Code"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      name="dob"
                      placeholder="YYYY-MM-DD"
                      control={form.control}
                      label="Date of Birth"
                    />
                    <CustomInput
                      name="ssn"
                      placeholder="Example: 1234"
                      control={form.control}
                      label="SSN"
                    />
                  </div>
                </>
              )}

              <CustomInput
                name="email"
                placeholder="Enter your email"
                control={form.control}
                label="Email"
              />
              <CustomInput
                name="password"
                placeholder="Enter your password"
                control={form.control}
                label="Password"
              />
              <div className="flex flex-col gap-4">
                <Button disabled={isLoading} type="submit" className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
