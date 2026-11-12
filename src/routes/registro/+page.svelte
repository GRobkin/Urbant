<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	let errores = $derived(form && 'errores' in form ? form.errores : undefined);
</script>

<svelte:head>
	<title>Crear cuenta · Urbant</title>
</svelte:head>

{#snippet error(mensaje: string | undefined)}
	{#if mensaje}<span class="mt-1.5 block text-sm font-medium text-alerta">{mensaje}</span>{/if}
{/snippet}

<div class="contenedor max-w-md pt-16">
	<h1 class="font-serif text-4xl text-marca">Crear una cuenta</h1>
	<p class="mt-2 text-texto-suave">
		Con tu cuenta puedes publicar tu inmueble y seguir tus solicitudes.
	</p>

	{#if form?.pendiente}
		<div class="mt-8 rounded-xl border border-borde bg-white p-5" role="status">
			<p class="font-bold">Datos recibidos, {form.nombre}</p>
			<p class="mt-1 text-texto-suave">La creación de cuentas se habilita en la próxima etapa.</p>
		</div>
	{/if}

	<form method="POST" novalidate use:enhance class="tarjeta mt-8 space-y-5 p-6 sm:p-8">
		<label class="block">
			<span class="etiqueta-campo">Nombre completo</span>
			<input
				name="nombre"
				autocomplete="name"
				value={form?.nombre ?? ''}
				aria-invalid={!!errores?.nombre}
				class="mt-1.5 w-full"
			/>
			{@render error(errores?.nombre)}
		</label>
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
				autocomplete="new-password"
				aria-invalid={!!errores?.password}
				class="mt-1.5 w-full"
			/>
			{@render error(errores?.password)}
		</label>
		<label class="block">
			<span class="etiqueta-campo">Repite la contraseña</span>
			<input
				type="password"
				name="confirmacion"
				autocomplete="new-password"
				aria-invalid={!!errores?.confirmacion}
				class="mt-1.5 w-full"
			/>
			{@render error(errores?.confirmacion)}
		</label>
		<button class="boton w-full">Crear cuenta</button>
	</form>

	<p class="mt-6 text-center text-texto-suave">
		¿Ya tienes cuenta?
		<a href="/login" class="font-semibold text-marca-claro hover:underline">Ingresar</a>
	</p>
</div>
