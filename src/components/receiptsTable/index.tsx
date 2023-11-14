import React from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Formats } from "@/lib/formats"
import { Prisma } from "@prisma/client"

interface ReceiptsTableProps {
  receipts: Prisma.ReceiptCreateInput[],
  caption?: string
}

const ReceiptsTable = ({ receipts, caption }: ReceiptsTableProps) => {
	return (
		<Table>
			<TableCaption>{caption}</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead className='text-right'>Tax amount</TableHead>
					<TableHead className='text-right'>Tax percentage</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{receipts.map((receipt, idx) => (
					<TableRow key={`${idx}-${receipt.date.toString()}`}>
						<TableCell className='font-medium'>{Formats.date(receipt.date.toString())}</TableCell>
						<TableCell className='text-right'>{Formats.currency(receipt.taxAmount)}</TableCell>
						<TableCell className='text-right'>{Formats.percentage(receipt.taxPercentage)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default ReceiptsTable
