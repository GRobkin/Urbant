<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	let errores = $derived(form && 'errores' in form ? form.errores : undefined);
</script>

<svelte:head>
	<title>Ingresar · Urbant</title>
</svelte:head>

{#snippet error(mensaje: string | undefined)}
	{#if mensaje}<span class="mt-1.5 block text-sm font-medium text-alerta">{mensaje}</span>{/if}
{/snippet}

<div class="contenedor max-w-md pt-16">
	<h1 class="font-serif text-4xl text-marca">Ingresar</h1>
	<p class="mt-2 text-texto-suave">Ingresa para publicar tu inmueble y seguir tus solicitudes.</p>

	{#if form?.pendiente}
		<div class="mt-8 rounded-xl border border-borde bg-white p-5" role="status">
			<p class="font-bold">Datos recibidos</p>
			<p class="mt-1 text-texto-suave">El inicio de sesión se habilita en la próxima etapa.</p>
		</div>
	{/if}

	<form method="POST" novalidate use:enhance class="tarjeta mt-8 space-y-5 p-6 sm:p-8">
		<label class="block">
			<span class="etiqueta-campo">Email</span>
			<input
				type="email"
				name="email"
				autocomplete="email"
				value={form?.email ?? ''}
				aria-invalid={!!errores?.email}
				class="mt-1.5 w-full"
			/>
			{@render error(errores?.email)}
		</label>
		<label class="block">
			<span class="etiqueta-campo">Contraseña</span>
			<input
				type="password"
				name="password"
				autocomplete="current-password"
				aria-invalid={!!errores?.password}
				class="mt-1.5 w-full"
			/>
			{@render error(errores?.password)}
		</label>
		<button class="boton w-full">Ingresar</button>
	</form>

	<p class="mt-6 text-center text-texto-suave">
		¿No tienes cuenta?
		<a href="/registro" class="font-semibold text-marca-claro hover:underline">Crear una cuenta</a>
	</p>
</div>
