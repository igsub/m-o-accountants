"use client"

import React from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogProps } from "@radix-ui/react-dialog"
import { useForm, type UseFormReturn } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Prisma } from "@prisma/client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const receiptFormSchema = z.object({
	date: z.date({
		required_error: "A date is required.",
	}),
	taxAmount: z.number({
		required_error: "Tax amount is required.",
	}),
	taxPercentage: z
		.number({
			required_error: "Tax percentage is required.",
		})
		.max(100),
})

interface ReceiptModalForm extends DialogProps {
	onCancel: () => void
	onSubmit: (values: Prisma.ReceiptCreateInput) => void
}

const ReceiptModalForm = (props: ReceiptModalForm) => {
	const { onCancel, onSubmit } = props

	const form = useForm<z.infer<typeof receiptFormSchema>>({
		resolver: zodResolver(receiptFormSchema),
		defaultValues: {
			date: undefined,
			taxAmount: 0,
			taxPercentage: 0,
		},
	})

	const onSave = (values: z.infer<typeof receiptFormSchema>) => {
		onSubmit(values)
		form.reset()
	}

	const onCancelClick = () => {
		onCancel()
		form.reset()
	}

	const isNumber = (value: string) => {
		return !isNaN(+value)
	}

	return (
		<Dialog {...props}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Add Receipt</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSave)} className='space-y-4'>
						<FormField
							control={form.control}
							name='date'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
													{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
													<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='start'>
											<Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='taxAmount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tax amount</FormLabel>
									<FormControl>
										<Input {...field} onChange={(event) => {
												isNumber(event.target.value) ? field.onChange(+event.target.value) : event.preventDefault()
											}} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='taxPercentage'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tax percentage</FormLabel>
									<FormControl>
										<Input placeholder='0.X' {...field} onChange={(event) => {
												isNumber(event.target.value) ? field.onChange(+event.target.value) : event.preventDefault()
											}} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button onClick={onCancelClick}>Cancel</Button>
							<Button type='submit'>Save</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default ReceiptModalForm
