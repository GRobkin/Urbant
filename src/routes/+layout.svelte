<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const enlaces = [
		{ href: '/catalogo?operacion=venta', ruta: '/catalogo', op: 'venta', texto: 'Comprar' },
		{ href: '/catalogo?operacion=alquiler', ruta: '/catalogo', op: 'alquiler', texto: 'Alquilar' },
		{ href: '/login', ruta: '/login', op: null, texto: 'Ingresar' }
	];

	function activo(e: (typeof enlaces)[number]): boolean {
		const ruta = page.url.pathname;
		if (e.op) return ruta === e.ruta && page.url.searchParams.get('operacion') === e.op;
		return ruta.startsWith(e.ruta);
	}

	let menuAbierto = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Urbant · Inmobiliaria</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="sticky top-0 z-30 border-b border-borde bg-white/95 backdrop-blur">
		<div class="contenedor flex h-16 items-center justify-between gap-6">
			<a href="/" class="flex items-baseline gap-2" aria-label="Urbant, ir al inicio">
				<span class="font-serif text-[1.65rem] leading-none text-marca">Urbant</span>
				<span class="hidden text-xs font-semibold text-arena sm:inline">Inmobiliaria</span>
			</a>

			<nav class="hidden items-center gap-7 md:flex" aria-label="Principal">
				{#each enlaces as e (e.texto)}
					<a
						href={e.href}
						aria-current={activo(e) ? 'page' : undefined}
						class="text-[0.95rem] font-semibold transition-colors {activo(e)
							? 'text-marca'
							: 'text-texto-suave hover:text-marca'}"
					>
						{e.texto}
					</a>
				{/each}
				<a href="/solicitudes/nueva" class="boton px-4 py-2.5 text-sm">Publicar inmueble</a>
			</nav>

			<button
				class="rounded-lg border border-borde px-3 py-2 text-sm font-semibold md:hidden"
				aria-expanded={menuAbierto}
				aria-controls="menu-movil"
				onclick={() => (menuAbierto = !menuAbierto)}
			>
				{menuAbierto ? 'Cerrar' : 'Menú'}
			</button>
		</div>

		{#if menuAbierto}
			<nav id="menu-movil" class="contenedor pb-4 md:hidden" aria-label="Principal">
				{#each enlaces as e (e.texto)}
					<a
						href={e.href}
						onclick={() => (menuAbierto = false)}
						class="block border-b border-borde py-3 font-semibold {activo(e)
							? 'text-marca'
							: 'text-texto'}"
					>
						{e.texto}
					</a>
				{/each}
				<a href="/solicitudes/nueva" onclick={() => (menuAbierto = false)} class="boton mt-4 w-full"
					>Publicar inmueble</a
				>
			</nav>
		{/if}
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="mt-24 bg-marca text-white/70">
		<div class="contenedor grid gap-10 py-14 sm:grid-cols-[1.5fr_1fr_1fr]">
			<div>
				<p class="font-serif text-3xl text-white">Urbant</p>
				<p class="mt-3 max-w-xs text-sm leading-relaxed">
					Casas, apartamentos y terrenos en venta y alquiler, revisados por nuestro equipo antes de
					publicarse.
				</p>
			</div>
			<div>
				<p class="text-sm font-bold text-white">Buscar</p>
				<ul class="mt-3 space-y-2 text-sm">
					<li>
						<a class="hover:text-white" href="/catalogo?operacion=venta">Propiedades en venta</a>
					</li>
					<li>
						<a class="hover:text-white" href="/catalogo?operacion=alquiler"
							>Propiedades en alquiler</a
						>
					</li>
					<li><a class="hover:text-white" href="/catalogo?garaje=si">Con garaje</a></li>
				</ul>
			</div>
			<div>
				<p class="text-sm font-bold text-white">Propietarios</p>
				<ul class="mt-3 space-y-2 text-sm">
					<li><a class="hover:text-white" href="/solicitudes/nueva">Publicar inmueble</a></li>
					<li><a class="hover:text-white" href="/registro">Crear una cuenta</a></li>
				</ul>
			</div>
		</div>
		<div class="border-t border-white/10">
			<p class="contenedor py-5 text-xs">
				© 2026 Inmobiliaria Urbant. Proyecto académico hecho con SvelteKit y TypeScript.
			</p>
		</div>
	</footer>
</div>
