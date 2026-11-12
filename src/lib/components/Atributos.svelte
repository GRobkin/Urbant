<!-- Dormitorios, baños, superficie y garaje con íconos. En un terreno, solo la superficie. -->
<script lang="ts">
	import Icono, { type NombreIcono } from './Icono.svelte';
	import type { TipoInmueble } from '#lib/types.ts';

	interface Props {
		tipo: TipoInmueble;
		dormitorios: number;
		banos: number;
		areaM2: number;
		garajeAutos: number;
	}

	let { tipo, dormitorios, banos, areaM2, garajeAutos }: Props = $props();

	type Dato = { icono: NombreIcono; valor: string; texto: string };

	let datos = $derived<Dato[]>(
		tipo === 'terreno'
			? [{ icono: 'area', valor: String(areaM2), texto: 'm² de terreno' }]
			: [
					{
						icono: 'cama',
						valor: String(dormitorios),
						texto: dormitorios === 1 ? 'dormitorio' : 'dormitorios'
					},
					{ icono: 'bano', valor: String(banos), texto: banos === 1 ? 'baño' : 'baños' },
					{ icono: 'area', valor: String(areaM2), texto: 'm²' },
					garajeAutos > 0
						? {
								icono: 'auto',
								valor: String(garajeAutos),
								texto: garajeAutos === 1 ? 'auto' : 'autos'
							}
						: { icono: 'auto', valor: 'Sin', texto: 'garaje' }
				]
	);
</script>

<ul class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-texto-suave">
	{#each datos as d (d.icono)}
		<li class="flex items-center gap-1.5">
			<Icono nombre={d.icono} class="size-4.5 text-marca-claro" />
			<span><span class="font-semibold text-texto">{d.valor}</span> {d.texto}</span>
		</li>
	{/each}
</ul>
