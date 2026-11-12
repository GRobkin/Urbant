<!-- Tarjeta de un inmueble (casa, apartamento o terreno) en el catálogo y en el inicio. -->
<script lang="ts">
	import type { Casa } from '#lib/types.ts';
	import {
		etiquetaEstadoCasa,
		formatearPrecio,
		fotoEnTamano,
		tipoYOperacion,
		ubicacion
	} from '#lib/formato.ts';
	import Icono from './Icono.svelte';
	import Atributos from './Atributos.svelte';

	let { casa }: { casa: Casa } = $props();
</script>

<article class="flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-borde">
	<div class="relative aspect-[4/3] overflow-hidden bg-marca-suave">
		<img
			src={fotoEnTamano(casa.foto, 720)}
			alt="Foto de {casa.direccion}, {ubicacion(casa.ciudad, casa.departamento)}"
			loading="lazy"
			class="size-full object-cover"
		/>
		<span
			class="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-marca shadow-sm"
		>
			{tipoYOperacion(casa.tipo, casa.operacion)}
		</span>
		{#if casa.estado !== 'disponible'}
			<span
				class="absolute top-3 right-3 rounded-full bg-marca px-3 py-1 text-xs font-bold text-white"
			>
				{etiquetaEstadoCasa[casa.estado]}
			</span>
		{/if}
	</div>

	<div class="flex flex-1 flex-col p-5">
		<p class="font-serif text-[1.7rem] leading-tight text-marca">
			{formatearPrecio(casa.precio)}
			{#if casa.operacion === 'alquiler'}
				<span class="font-sans text-sm text-texto-suave">por mes</span>
			{/if}
		</p>
		<p class="mt-2 font-semibold">{casa.direccion}</p>
		<p class="mt-0.5 flex items-center gap-1 text-sm text-texto-suave">
			<Icono nombre="ubicacion" class="size-4" />
			{ubicacion(casa.ciudad, casa.departamento)}
		</p>
		<div class="mt-auto border-t border-borde pt-4" style="margin-top: max(1.25rem, auto)">
			<Atributos
				tipo={casa.tipo}
				dormitorios={casa.dormitorios}
				banos={casa.banos}
				areaM2={casa.areaM2}
				garajeAutos={casa.garajeAutos}
			/>
		</div>
	</div>
</article>
