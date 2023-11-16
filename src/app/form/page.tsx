"use client"
import ReceiptModalForm from "@/components/receiptModalForm"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Prisma } from "@prisma/client"
import { Loader2 } from "lucide-react"
import ReceiptsTable from "@/components/receiptsTable"

const formSchema = z.object({
	companyName: z.string().min(2).max(100),
	fiscalIdCode: z.string().length(11, "Fiscal ID Code must have 11 characters"),
	clientNumber: z.number().min(1),
})

const Page = () => {
	const { toast } = useToast()
	const [openAddReceiptModal, setOpenAddReceiptModal] = useState(false)
	const [receipts, setReceipts] = useState<Prisma.ReceiptCreateInput[]>([])
	const [loading, setLoading] = useState(false)

	const invalidFiscalIdCodeToast = () => toast({ description: "Invalid Fiscal ID Code", variant: "destructive", className: cn("top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4") })
	const validFiscalIdCodeToast = () => toast({ description: "Fiscal ID Code validated OK", className: cn("top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-300") })
	const saveSucceded = () => toast({ description: "Form saved with success", className: cn("top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-300") })

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: "",
			fiscalIdCode: "",
			clientNumber: 0,
		},
	})

	const saveForm = (values: z.infer<typeof formSchema>) => {
		setLoading(true)
		fetch("/api/form", {
			method: "POST",
			body: JSON.stringify({ ...values, receipts }),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setLoading(false)
				saveSucceded()
				form.reset()
				setReceipts([])
			})
	}

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true)
		fetch("/api/form/validateFiscalIdCode", {
			method: "POST",
			body: JSON.stringify(values.fiscalIdCode),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data) {
					validFiscalIdCodeToast()
					saveForm(values)
				} else {
					setLoading(false)
					invalidFiscalIdCodeToast()
				}
			})
	}

	const handleReceiptSubmit = (values: Prisma.ReceiptCreateInput) => {
		setReceipts((prevReceipts) => [...prevReceipts, values])
		setOpenAddReceiptModal(false)
	}

	const handleReceiptCancel = () => {
		setOpenAddReceiptModal(false)
	}

	return (
		<div className='flex flex-col gap-4 md:flex-row justify-center w-full md:w-2/3'>
			<div className='w-1/3'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='flex flex-col space-y-4'>
							<FormField
								control={form.control}
								name='companyName'
								disabled={loading}
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
								disabled={loading}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fiscal ID Code</FormLabel>
										<FormControl>
											<Input placeholder='Fiscal ID Code' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='clientNumber'
								disabled={loading}
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
			<div className='flex flex-col gap-4 w-2/3'>
				<ReceiptModalForm open={openAddReceiptModal} onOpenChange={setOpenAddReceiptModal} onCancel={handleReceiptCancel} onSubmit={handleReceiptSubmit} />
				<ReceiptsTable receipts={receipts} caption='Created receipts.' />
				<Button variant='secondary' onClick={() => setOpenAddReceiptModal(true)} disabled={loading}>
					+ Add Receipt
				</Button>
			</div>
		</div>
	)
}

export default Page
