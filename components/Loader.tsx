import {Loader2} from "lucide-react";

const Loader = () => {
	return (
		<div className='flex flex-col flex-1 justify-center items-center'>
			<Loader2 className='h-7 w-7 text-primary animate-spin my-4' />
		</div>
	);
};
export default Loader;
