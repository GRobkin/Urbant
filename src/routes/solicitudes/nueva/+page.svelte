<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { DEPARTAMENTOS } from '#lib/uruguay.ts';

	// `form` contiene lo que devolvió la Form Action (ActionData)
	let { form }: PageProps = $props();

	let enviando = $state(false);
	let tieneGaraje = $state(false);
	let tipo = $state('');

	// Un terreno no tiene dormitorios, baños ni garaje
	let esTerreno = $derived(tipo === 'terreno');

	let valores = $derived(form && 'valores' in form ? form.valores : undefined);
	let errores = $derived(form && 'errores' in form ? form.errores : undefined);
	let cantidadErrores = $derived(errores ? Object.keys(errores).length : 0);

	// Si la acción devolvió valores (por un error) se recupera lo elegido
	$effect(() => {
		if (valores) {
			tieneGaraje = valores.tieneGaraje;
			tipo = valores.tipo;
		}
		if (form?.exito) {
			tieneGaraje = false;
			tipo = '';
		}
	});

	const tipos = [
		{ valor: 'casa', texto: 'Casa' },
		{ valor: 'apartamento', texto: 'Apartamento' },
		{ valor: 'terreno', texto: 'Terreno' }
	];

	const operaciones = [
		{ valor: 'venta', texto: 'Vender', detalle: 'Precio total' },
		{ valor: 'alquiler', texto: 'Alquilar', detalle: 'Precio mensual' }
	];

	const campo = 'mt-1.5 w-full';
	const seccion = 'border-t border-borde pt-8';
	const leyenda = 'float-left mb-5 w-full font-serif text-2xl text-marca';
	const grilla = 'clear-both grid gap-5 sm:grid-cols-2';
</script>

<svelte:head>
	<title>Publique su inmueble · Urbant</title>
</svelte:head>

{#snippet error(mensaje: string | undefined, id: string)}
	{#if mensaje}<span {id} class="mt-1.5 block text-sm font-medium text-alerta">{mensaje}</span>{/if}
{/snippet}

<div class="contenedor max-w-3xl pt-12">
	<h1 class="font-serif text-4xl text-marca sm:text-5xl">Publique su inmueble</h1>
	<p class="mt-3 max-w-prose text-lg leading-relaxed text-texto-suave">
		Completa los datos de tu casa, apartamento o terreno. Nuestro equipo lo revisa y, si está todo
		en orden, lo publica en el catálogo.
	</p>

	{#if form?.exito}
		<div class="mt-8 rounded-xl border border-disponible/30 bg-disponible/5 p-5" role="status">
			<p class="font-bold text-disponible">Recibimos tu solicitud n.º {form.solicitudId}</p>
			<p class="mt-1 text-texto-suave">
				Está pendiente de revisión. Nuestro equipo la revisará antes de publicarla.
			</p>
		</div>
	{:else if cantidadErrores > 0}
		<div class="mt-8 rounded-xl border border-alerta/30 bg-alerta/5 p-5" role="alert">
			<p class="font-bold text-alerta">
				{cantidadErrores === 1 ? 'Hay un campo' : `Hay ${cantidadErrores} campos`} por corregir
			</p>
			<p class="mt-1 text-texto-suave">Están marcados en rojo más abajo.</p>
		</div>
	{/if}

	<form
		method="POST"
		novalidate
		use:enhance={() => {
			enviando = true;
			return async ({ update }) => {
				await update();
				enviando = false;
			};
		}}
		class="tarjeta mt-8 space-y-10 p-6 sm:p-10"
	>
		<fieldset>
			<legend class={leyenda}>Tus datos de contacto</legend>
			<div class={grilla}>
				<label>
					<span class="etiqueta-campo">Nombre completo</span>
					<input
						name="clienteNombre"
						autocomplete="name"
						value={valores?.clienteNombre ?? ''}
						aria-invalid={!!errores?.clienteNombre}
						aria-describedby="e-nombre"
						class={campo}
					/>
					{@render error(errores?.clienteNombre, 'e-nombre')}
				</label>
				<label>
					<span class="etiqueta-campo">Email</span>
					<input
						type="email"
						name="clienteEmail"
						autocomplete="email"
						value={valores?.clienteEmail ?? ''}
						aria-invalid={!!errores?.clienteEmail}
						aria-describedby="e-email"
						class={campo}
					/>
					{@render error(errores?.clienteEmail, 'e-email')}
				</label>
			</div>
		</fieldset>

		<fieldset class={seccion}>
			<legend class={leyenda}>Tipo de inmueble</legend>
			<div class="clear-both" role="radiogroup" aria-describedby="e-tipo">
				<div class="grid grid-cols-3 gap-3">
					{#each tipos as t (t.valor)}
						<label
							class="flex cursor-pointer items-center gap-3 rounded-xl border border-borde p-4 font-bold transition-colors has-checked:border-marca has-checked:bg-marca-suave"
						>
							<input
								type="radio"
								name="tipo"
								value={t.valor}
								bind:group={tipo}
								class="text-marca"
							/>
							{t.texto}
						</label>
					{/each}
				</div>
				{@render error(errores?.tipo, 'e-tipo')}
			</div>
		</fieldset>

		<fieldset class={seccion}>
			<legend class={leyenda}>Ubicación</legend>
			<div class={grilla}>
				<label>
					<span class="etiqueta-campo">Departamento</span>
					<select
						name="departamento"
						aria-invalid={!!errores?.departamento}
						aria-describedby="e-departamento"
						class={campo}
					>
						<option value="">Elegir…</option>
						{#each DEPARTAMENTOS as d (d)}
							<option value={d} selected={valores?.departamento === d}>{d}</option>
						{/each}
					</select>
					{@render error(errores?.departamento, 'e-departamento')}
				</label>
				<label>
					<span class="etiqueta-campo">Ciudad o localidad</span>
					<input
						name="ciudad"
						placeholder="Ej.: Punta del Este"
						value={valores?.ciudad ?? ''}
						aria-invalid={!!errores?.ciudad}
						aria-describedby="e-ciudad"
						class={campo}
					/>
					{@render error(errores?.ciudad, 'e-ciudad')}
				</label>
				<label class="sm:col-span-2">
					<span class="etiqueta-campo">Dirección</span>
					<input
						name="direccion"
						placeholder="Ej.: Av. Italia 3050"
						value={valores?.direccion ?? ''}
						aria-invalid={!!errores?.direccion}
						aria-describedby="e-direccion"
						class={campo}
					/>
					{@render error(errores?.direccion, 'e-direccion')}
				</label>
			</div>
		</fieldset>

		<fieldset class={seccion}>
			<legend class={leyenda}>Operación y precio</legend>
			<div class={grilla}>
				<div class="sm:col-span-2" role="radiogroup" aria-labelledby="t-op" aria-describedby="e-op">
					<span id="t-op" class="etiqueta-campo">¿Venta o alquiler?</span>
					<div class="mt-1.5 grid grid-cols-2 gap-3">
						{#each operaciones as op (op.valor)}
							<label
								class="flex cursor-pointer items-center gap-3 rounded-xl border border-borde p-4 transition-colors has-checked:border-marca has-checked:bg-marca-suave"
							>
								<input
									type="radio"
									name="operacion"
									value={op.valor}
									checked={valores?.operacion === op.valor}
									class="text-marca"
								/>
								<span>
									<span class="block font-bold">{op.texto}</span>
									<span class="text-sm text-texto-suave">{op.detalle}</span>
								</span>
							</label>
						{/each}
					</div>
					{@render error(errores?.operacion, 'e-op')}
				</div>
				<label>
					<span class="etiqueta-campo">Precio en US$</span>
					<input
						type="number"
						name="precio"
						min="1"
						value={valores?.precio ?? ''}
						aria-invalid={!!errores?.precio}
						aria-describedby="e-precio"
						class={campo}
					/>
					{@render error(errores?.precio, 'e-precio')}
				</label>
			</div>
		</fieldset>

		<fieldset class={seccion}>
			<legend class={leyenda}>El inmueble</legend>
			<div class="{grilla} lg:grid-cols-3">
				{#if !esTerreno}
					<label>
						<span class="etiqueta-campo">Dormitorios</span>
						<input
							type="number"
							name="dormitorios"
							min="0"
							value={valores?.dormitorios ?? ''}
							aria-invalid={!!errores?.dormitorios}
							aria-describedby="e-dormitorios"
							class={campo}
						/>
						{@render error(errores?.dormitorios, 'e-dormitorios')}
					</label>
					<label>
						<span class="etiqueta-campo">Baños</span>
						<input
							type="number"
							name="banos"
							min="1"
							value={valores?.banos ?? ''}
							aria-invalid={!!errores?.banos}
							aria-describedby="e-banos"
							class={campo}
						/>
						{@render error(errores?.banos, 'e-banos')}
					</label>
				{/if}
				<label>
					<span class="etiqueta-campo">Superficie (m²)</span>
					<input
						type="number"
						name="areaM2"
						min="10"
						value={valores?.areaM2 ?? ''}
						aria-invalid={!!errores?.areaM2}
						aria-describedby="e-area"
						class={campo}
					/>
					{@render error(errores?.areaM2, 'e-area')}
				</label>

				<!-- Garaje: la casilla habilita el campo de cantidad de autos -->
				{#if !esTerreno}
					<div
						class="rounded-xl border p-4 transition-colors sm:col-span-2 lg:col-span-3 {tieneGaraje
							? 'border-marca bg-marca-suave'
							: 'border-borde'}"
					>
						<label class="flex cursor-pointer items-center gap-3 font-bold">
							<input
								type="checkbox"
								name="tieneGaraje"
								bind:checked={tieneGaraje}
								class="size-5 rounded text-marca"
							/>
							Tiene garaje
						</label>
						<label class="mt-4 block max-w-xs {tieneGaraje ? '' : 'opacity-50'}">
							<span class="etiqueta-campo">¿Para cuántos autos?</span>
							<input
								type="number"
								name="garajeAutos"
								min="1"
								max="10"
								disabled={!tieneGaraje}
								value={valores?.garajeAutos || (tieneGaraje ? '1' : '')}
								aria-invalid={!!errores?.garajeAutos}
								aria-describedby="e-garaje"
								class="{campo} disabled:cursor-not-allowed disabled:bg-fondo"
							/>
							{@render error(errores?.garajeAutos, 'e-garaje')}
						</label>
					</div>
				{/if}

				<label class="sm:col-span-2 lg:col-span-3">
					<span class="etiqueta-campo">Otras características, separadas por comas</span>
					<input
						name="caracteristicas"
						placeholder="Ej.: Piscina, Parrillero, Balcón"
						value={valores?.caracteristicas ?? ''}
						class={campo}
					/>
				</label>
				<label class="sm:col-span-2 lg:col-span-3">
					<span class="etiqueta-campo">Descripción</span>
					<textarea
						name="descripcion"
						rows="5"
						placeholder="Qué la hace especial: la luz, el barrio, el estado, lo que hay cerca."
						aria-invalid={!!errores?.descripcion}
						aria-describedby="e-descripcion"
						class={campo}>{valores?.descripcion ?? ''}</textarea
					>
					{@render error(errores?.descripcion, 'e-descripcion')}
				</label>
			</div>
		</fieldset>

		<div class="flex flex-wrap items-center gap-4 border-t border-borde pt-8">
			<button disabled={enviando} class="boton">
				{enviando ? 'Enviando solicitud…' : 'Enviar solicitud'}
			</button>
			<p class="text-sm text-texto-suave">Nuestro equipo la revisa antes de publicarla.</p>
		</div>
	</form>
</div>
