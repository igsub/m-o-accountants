"use client"

import Link from "next/link"
import React from "react"
import { Button } from "../ui/button"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

const Navbar = () => {
	const { data: session, status } = useSession()

	const handleLogOut = () => {
		signOut({
			callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,
		})
	}

	return (
		<nav className='bg-white w-full border-b md:border-0'>
			<div className='flex justify-between px-4 max-w-screen-xl mx-auto md:flex md:px-8 md:py-5'>
				<Link href='/'>
					<h1 className='text-3xl font-bold text-slate-600'>Logo</h1>
				</Link>
				{status === "loading" || status === "unauthenticated" ? null : (
					<div className='space-x-2'>
						<span>{session?.user?.name || session?.user?.name}</span>
						<Button className='border-red-200 text-red-400' variant='outline' onClick={() => handleLogOut()}>
							Log out
						</Button>
					</div>
				)}
			</div>
		</nav>
	)
}

export default Navbar
