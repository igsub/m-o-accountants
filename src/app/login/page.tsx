'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'

const formSchema = z.object({
	email: z.string(),
	password: z.string(),
})

const Page = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    
    await signIn("credentials", {
      email: values.email,
      password: values.password,
			callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}accountant`,
    })

		setLoading(false)
  }

  return (
    <div>
      <Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='flex flex-col space-y-4'>
							<FormField
								control={form.control}
								name='email'
								disabled={loading}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='abc@abc.com' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								disabled={loading}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type='password' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' disabled={loading}>
								{!loading ? (
									"Submit"
								) : (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Please wait...
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
    </div>
  )
}

export default Page