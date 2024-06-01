"use client";
import {Menu} from "lucide-react";

import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";

import LeftSidebar from "@/components/shared/Sidebar/LeftSidebar";

export const MobileSidebar = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Menu className='lg:hidden' />
			</SheetTrigger>
			<SheetContent
				side='left'
				className='p-0 flex gap-0'
			>
				<LeftSidebar />
			</SheetContent>
		</Sheet>
	);
};
