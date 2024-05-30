import {Menu} from "lucide-react";

import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import LeftSidebar from "@/app/(main)/_components/LeftSidebar/LeftSidebar";

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
