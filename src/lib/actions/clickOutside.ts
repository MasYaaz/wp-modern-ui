export function clickOutside(
	node: HTMLElement,
	params: { ignore?: HTMLElement[], callback: () => void }
) {
	const handleClick = (event: MouseEvent) => {
		const isIgnored = params.ignore?.some(el => el?.contains(event.target as Node));
		if (!node.contains(event.target as Node) && !isIgnored) {
			params.callback();
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
