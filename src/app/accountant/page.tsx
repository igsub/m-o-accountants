"use client"

import ReceiptsTable from "@/components/receiptsTable"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Prisma } from "@prisma/client"
import { Dialog } from "@radix-ui/react-dialog"
import React, { useEffect, useState } from "react"
import { Check } from "lucide-react"

type Form = Prisma.FormGetPayload<{
	include: {
		receipts: true
	}
}>

type Receipt = Prisma.ReceiptGetPayload<{
	select: {
		taxAmount: true
		taxPercentage: true
		date: true
		id: true
	}
}>

const Page = () => {
	const [forms, setForms] = useState<Form[]>([])
	const [showReceiptsModal, setShowReceiptsModal] = useState(false)
	const [currentReceipts, setCurrentReceipts] = useState<Receipt[]>([])

	useEffect(() => {
		fetch("/api/form", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setForms(data)
			})
	}, [])

	const handleViewReceipts = (receipts: Receipt[]) => {
		setCurrentReceipts(receipts)
		setShowReceiptsModal(true)
	}

	const onCloseClick = () => {
		setShowReceiptsModal(false)
	}

	const handleApprove = (id: string) => {
		fetch("/api/form/approve", {
			method: "POST",
			body: JSON.stringify(id),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data)
				const newForms = forms.map((form) => {
					if (form.id === data.id) return { ...form, approved: data.approved }
					return form
				})
				setForms(newForms)
			})
	}

	return (
		<div className='w-full'>
			<Table>
				<TableCaption>Available forms.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Company name</TableHead>
						<TableHead>Fiscal ID code</TableHead>
						<TableHead>Client number</TableHead>
						<TableHead>Approved</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{forms.map((form, idx) => (
						<TableRow key={`${idx}-${form.id}`}>
							<TableCell className='font-medium'>{form.companyName}</TableCell>
							<TableCell>{form.fiscalIdCode}</TableCell>
							<TableCell>{form.clientNumber}</TableCell>
							<TableCell>{form.approved ? <Check className='text-green-600' /> : '-'}</TableCell>
							<TableCell className='md:space-x-2 md:mb-0'>
								<Button size='sm' variant='outline' className="mb-1 md:mb-0" onClick={() => handleViewReceipts(form.receipts)}>
									Receipts
								</Button>
								{form.approved ? null : <Button size='sm' onClick={() => handleApprove(form.id)}>Approve</Button>}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={showReceiptsModal} onOpenChange={setShowReceiptsModal}>
				<DialogContent className='sm:max-w-md md:max-w-xl'>
					<DialogHeader>
						<DialogTitle>Receipts</DialogTitle>
					</DialogHeader>
					<ReceiptsTable receipts={currentReceipts} caption='Asociated receipts.' />
					<DialogFooter>
						<Button onClick={onCloseClick}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default Page
