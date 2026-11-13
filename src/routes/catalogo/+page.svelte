<script lang="ts">
	import type { PageProps } from './$types';
	import TarjetaCasa from '#lib/components/TarjetaCasa.svelte';
	import { etiquetaTipo, pluralTipo } from '#lib/formato.ts';
	import type { TipoInmueble } from '#lib/types.ts';
	import { DEPARTAMENTOS } from '#lib/uruguay.ts';

	const tipos = Object.entries(etiquetaTipo) as [TipoInmueble, string][];

	let { data }: PageProps = $props();

	let hayFiltros = $derived(Object.values(data.filtros).some((v) => v !== undefined));

	// Ej.: 'Apartamentos en venta', 'Propiedades en venta y alquiler'
	let titulo = $derived(
		(data.filtros.tipo ? pluralTipo[data.filtros.tipo] : 'Propiedades') +
			(data.filtros.operacion === 'venta'
				? ' en venta'
				: data.filtros.operacion === 'alquiler'
					? ' en alquiler'
					: ' en venta y alquiler')
	);
</script>

<svelte:head>
	<title>{titulo} · Urbant</title>
</svelte:head>

<section class="border-b border-borde bg-white">
	<div class="contenedor py-10">
		<h1 class="font-serif text-4xl text-marca sm:text-5xl">
			{titulo}{data.filtros.departamento ? ` en ${data.filtros.departamento}` : ' en todo Uruguay'}
		</h1>
		<p class="mt-2 text-texto-suave">
			{data.casas.length}
			{data.casas.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
		</p>

		<!-- Los filtros viajan por GET en la URL y los procesa la función load -->
		<form method="GET" class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:items-end">
			<label>
				<span class="etiqueta-campo">Tipo</span>
				<select name="tipo" class="mt-1.5 w-full">
					<option value="">Todos</option>
					{#each tipos as [valor, texto] (valor)}
						<option value={valor} selected={data.filtros.tipo === valor}>{texto}</option>
					{/each}
				</select>
			</label>
			<label>
				<span class="etiqueta-campo">Operación</span>
				<select name="operacion" class="mt-1.5 w-full">
					<option value="">Todas</option>
					<option value="venta" selected={data.filtros.operacion === 'venta'}>Venta</option>
					<option value="alquiler" selected={data.filtros.operacion === 'alquiler'}>
						Alquiler
					</option>
				</select>
			</label>
			<label>
				<span class="etiqueta-campo">Departamento</span>
				<select name="departamento" class="mt-1.5 w-full">
					<option value="">Todo Uruguay</option>
					{#each DEPARTAMENTOS as d (d)}
						<option value={d} selected={data.filtros.departamento === d}>{d}</option>
					{/each}
				</select>
			</label>
			<label>
				<span class="etiqueta-campo">Precio desde</span>
				<input
					type="number"
					name="precioMin"
					min="0"
					placeholder="US$"
					value={data.filtros.precioMin ?? ''}
					class="mt-1.5 w-full"
				/>
			</label>
			<label>
				<span class="etiqueta-campo">Precio hasta</span>
				<input
					type="number"
					name="precioMax"
					min="0"
					placeholder="US$"
					value={data.filtros.precioMax ?? ''}
					class="mt-1.5 w-full"
				/>
			</label>
			<label>
				<span class="etiqueta-campo">Dormitorios</span>
				<select name="dormitorios" class="mt-1.5 w-full">
					<option value="">Cualquiera</option>
					{#each [1, 2, 3, 4] as n (n)}
						<option value={n} selected={data.filtros.dormitorios === n}>{n} o más</option>
					{/each}
				</select>
			</label>
			<button class="boton">Buscar</button>

			<div class="flex flex-wrap items-center gap-6 sm:col-span-2 lg:col-span-7">
				<label class="flex cursor-pointer items-center gap-2 text-sm font-semibold">
					<input
						type="checkbox"
						name="garaje"
						value="si"
						checked={data.filtros.conGaraje}
						class="size-5 rounded text-marca"
					/>
					Solo con garaje
				</label>
				{#if hayFiltros}
					<a href="/catalogo" class="text-sm font-semibold text-marca-claro hover:underline">
						Quitar filtros
					</a>
				{/if}
			</div>
		</form>
	</div>
</section>

<section class="contenedor pt-10" aria-label="Resultados">
	{#if data.casas.length > 0}
		<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.casas as casa (casa.id)}
				<li><TarjetaCasa {casa} /></li>
			{/each}
		</ul>
	{:else}
		<div class="tarjeta px-8 py-16 text-center">
			<p class="font-serif text-3xl text-marca">Ninguna propiedad coincide con esta búsqueda</p>
			<p class="mx-auto mt-3 max-w-md text-texto-suave">
				Prueba ampliar el rango de precio, elegir otro departamento o quitar el filtro de garaje.
			</p>
			<a href="/catalogo" class="boton mt-8">Ver todas las propiedades</a>
		</div>
	{/if}
</section>
