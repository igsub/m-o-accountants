"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
	companyName: z.string().min(2).max(100),
	fiscalIdCode: z.string().length(11, "Fiscal ID Code must have 11 characters"),
	clientNumber: z.number().min(1),
})

const Page = () => {
	const [validFiscalIdCode, setValidFiscalIdCode] = useState(false)
	const { toast } = useToast()

	const invalidFiscalIdCodeToast = () => toast({ description: 'Invalid Fiscal ID Code', variant: 'destructive', className: cn(
		'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
	) })
	const validFiscalIdCodeToast = () => toast({ description: 'Fiscal ID Code validated OK', className: cn(
		'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-300'
	)})
	const saveSucceded = () => toast({ description: 'Form saved with success', className: cn(
		'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-300'
	)})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: "",
			fiscalIdCode: "",
			clientNumber: 0,
		},
	})

	const saveForm = (values: z.infer<typeof formSchema>) => {
		fetch("/api/form", {
			method: "POST",
			body: JSON.stringify(values),
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(response => response.json())
		.then(data => {
			saveSucceded()
		})
	}

	const onSubmit = async (values: z.infer<typeof formSchema>) => {

		fetch("/api/form/validateFiscalIdCode", {
			method: "POST",
			body: JSON.stringify(values.fiscalIdCode),
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(response => response.json())
		.then(data => {
			setValidFiscalIdCode(data)
			if (data) { 
				validFiscalIdCodeToast()
				saveForm(values)
			} else invalidFiscalIdCodeToast()
		});

	}


	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
				<div className='space-x-4 flex flex-row'>
					<div className='flex flex-col space-y-4'>
						<FormField
							control={form.control}
							name='companyName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company Name</FormLabel>
									<FormControl>
										<Input placeholder='Company Name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='fiscalIdCode'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fiscal ID Code</FormLabel>
									<FormControl>
										<Input placeholder='Fiscal ID Code' {...field}/>
									</FormControl>
									<FormDescription>This is your public display name.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='clientNumber'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Client Number</FormLabel>
									<FormControl>
										<Input placeholder='Client Number' {...field} onChange={(event) => field.onChange(+event.target.value)} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Submit</Button>
					</div>
					<div className='flex flex-col'>
						<Button variant='outline'>Add Receipt</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}

export default Page
