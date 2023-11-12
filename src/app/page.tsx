"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
	const router = useRouter()
	return (
		<>
			<Button onClick={() => router.push("/form")}>New Form</Button>
			<Button variant='outline' onClick={() => router.push("/accountant")}>
				I'm an Accountant
			</Button>
		</>
	)
}
