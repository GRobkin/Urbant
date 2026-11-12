<script lang="ts">
	import type { PageProps } from './$types';
	import TarjetaCasa from '#lib/components/TarjetaCasa.svelte';
	import { DEPARTAMENTOS } from '#lib/uruguay.ts';

	let { data }: PageProps = $props();

	const fotoPortada =
		'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=75';

	const pasos = [
		{
			titulo: 'Envía los datos de tu inmueble',
			texto: 'Dirección, precio, si es venta o alquiler, garaje y lo que la hace especial.'
		},
		{
			titulo: 'Nuestro equipo la revisa',
			texto: 'Si falta algo, te dejamos el motivo para que puedas corregirlo.'
		},
		{
			titulo: 'Se publica en el catálogo',
			texto:
				'Desde ese momento la encuentran quienes buscan por departamento, precio o dormitorios.'
		}
	];
</script>

<!-- Portada con buscador: el formulario viaja por GET al catálogo -->
<section class="relative isolate overflow-hidden bg-marca">
	<img src={fotoPortada} alt="" class="absolute inset-0 -z-10 size-full object-cover" />
	<div
		class="absolute inset-0 -z-10 bg-linear-to-r from-marca via-marca/85 to-marca/30"
		aria-hidden="true"
	></div>

	<div class="contenedor py-20 sm:py-28">
		<h1 class="max-w-2xl font-serif text-5xl leading-[1.05] text-white sm:text-6xl">
			Encuentra un inmueble a la altura de tu próxima etapa
		</h1>
		<p class="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
			Propiedades en venta y alquiler, revisadas una por una por nuestro equipo antes de publicarse.
		</p>

		<form
			action="/catalogo"
			method="GET"
			class="mt-10 grid max-w-4xl gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr_1fr_auto]"
		>
			<label class="sr-only" for="b-tipo">Tipo de inmueble</label>
			<select id="b-tipo" name="tipo" class="border-0 py-3 font-semibold">
				<option value="">Todos los tipos</option>
				<option value="casa">Casas</option>
				<option value="apartamento">Apartamentos</option>
				<option value="terreno">Terrenos</option>
			</select>
			<label class="sr-only" for="b-operacion">Operación</label>
			<select id="b-operacion" name="operacion" class="border-0 py-3 font-semibold">
				<option value="">Comprar o alquilar</option>
				<option value="venta">Comprar</option>
				<option value="alquiler">Alquilar</option>
			</select>
			<label class="sr-only" for="b-departamento">Departamento</label>
			<select id="b-departamento" name="departamento" class="border-0 py-3 font-semibold">
				<option value="">Todo Uruguay</option>
				{#each DEPARTAMENTOS as d (d)}
					<option value={d}>{d}</option>
				{/each}
			</select>
			<label class="sr-only" for="b-precio">Precio máximo</label>
			<input
				id="b-precio"
				type="number"
				name="precioMax"
				min="0"
				placeholder="Precio máximo (US$)"
				class="border-0 py-3"
			/>
			<button class="boton">Buscar</button>
		</form>
	</div>
</section>

{#if data.recientes.length > 0}
	<section class="contenedor pt-20">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<h2 class="font-serif text-4xl text-marca">Recién publicadas</h2>
				<p class="mt-2 text-texto-suave">Las últimas propiedades que aprobó nuestro equipo.</p>
			</div>
			<a href="/catalogo" class="boton-secundario">Ver todo el catálogo</a>
		</div>
		<ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.recientes as casa (casa.id)}
				<li><TarjetaCasa {casa} /></li>
			{/each}
		</ul>
	</section>
{/if}

<section class="contenedor pt-24">
	<div class="tarjeta grid gap-12 p-8 sm:p-12 lg:grid-cols-[1fr_1.4fr]">
		<div>
			<h2 class="font-serif text-4xl text-marca">¿Quieres vender o alquilar tu inmueble?</h2>
			<p class="mt-4 max-w-md leading-relaxed text-texto-suave">
				Completa un formulario con los datos de la propiedad y nuestro equipo se encarga del resto.
			</p>
			<a href="/solicitudes/nueva" class="boton mt-8">Publicar inmueble</a>
		</div>
		<ol class="grid gap-8 sm:grid-cols-3">
			{#each pasos as paso, i (paso.titulo)}
				<li>
					<span
						class="flex size-10 items-center justify-center rounded-full bg-marca-suave font-serif text-xl text-marca"
					>
						{i + 1}
					</span>
					<h3 class="mt-4 font-bold">{paso.titulo}</h3>
					<p class="mt-2 text-sm leading-relaxed text-texto-suave">{paso.texto}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>
