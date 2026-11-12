<!-- Íconos de línea propios (sin dependencias externas). -->
<script lang="ts" module>
	export type NombreIcono = 'cama' | 'bano' | 'area' | 'auto' | 'ubicacion';
</script>

<script lang="ts">
	let { nombre, class: clase = 'size-5' }: { nombre: NombreIcono; class?: string } = $props();

	const trazos: Record<NombreIcono, string> = {
		cama: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18M6 10V7.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 12 7.5V10M3 18v2M21 18v2"/>',
		bano: '<path d="M4 12h16v2.5A4.5 4.5 0 0 1 15.5 19h-7A4.5 4.5 0 0 1 4 14.5V12zM6 12V6.5a2.5 2.5 0 0 1 5 0M7 19l-1 2M17 19l1 2"/>',
		area: '<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M9 4v4M4 9h4M15 20v-4M20 15h-4"/>',
		auto: '<path d="M4 16l1.6-5.1A2 2 0 0 1 7.5 9.5h9a2 2 0 0 1 1.9 1.4L20 16M3.5 16h17v3h-17zM6 19v1.5M18 19v1.5M7.5 13.5h.01M16.5 13.5h.01"/>',
		ubicacion:
			'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'
	};
</script>

<svg
	class={clase}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{@html trazos[nombre]}
</svg>
