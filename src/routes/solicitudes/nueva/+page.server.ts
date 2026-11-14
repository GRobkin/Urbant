import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { crearSolicitud } from '#lib/server/datos.ts';
import type { TipoInmueble } from '#lib/types.ts';
import { esDepartamento, type Departamento } from '#lib/uruguay.ts';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /solicitudes/nueva  →  el cliente envía la solicitud de publicación de su casa
export const actions = {
	default: async ({ request }) => {
		const formulario = await request.formData();
		const texto = (campo: string) => String(formulario.get(campo) ?? '').trim();

		// Valores tal como llegaron, para devolverlos al formulario si hay errores
		const valores = {
			clienteNombre: texto('clienteNombre'),
			clienteEmail: texto('clienteEmail'),
			tipo: texto('tipo'),
			direccion: texto('direccion'),
			departamento: texto('departamento'),
			ciudad: texto('ciudad'),
			precio: texto('precio'),
			operacion: texto('operacion'),
			dormitorios: texto('dormitorios'),
			banos: texto('banos'),
			areaM2: texto('areaM2'),
			tieneGaraje: formulario.get('tieneGaraje') === 'on',
			garajeAutos: texto('garajeAutos'),
			caracteristicas: texto('caracteristicas'),
			descripcion: texto('descripcion')
		};

		// ---- Validación en el servidor ----
		const errores: Partial<Record<keyof typeof valores, string>> = {};

		if (valores.clienteNombre.length < 3) errores.clienteNombre = 'Ingresa tu nombre completo.';
		if (!EMAIL_VALIDO.test(valores.clienteEmail)) errores.clienteEmail = 'Ingresa un email válido.';
		if (valores.tipo !== 'casa' && valores.tipo !== 'apartamento' && valores.tipo !== 'terreno')
			errores.tipo = 'Elige si es casa, apartamento o terreno.';
		// Un terreno no tiene dormitorios, baños ni garaje: esos campos no se validan
		const esTerreno = valores.tipo === 'terreno';

		if (valores.direccion.length < 5) errores.direccion = 'Ingresa la dirección completa.';
		if (!esDepartamento(valores.departamento)) errores.departamento = 'Elige el departamento.';
		if (valores.ciudad.length < 2) errores.ciudad = 'Ingresa la ciudad o localidad.';
		if (valores.operacion !== 'venta' && valores.operacion !== 'alquiler')
			errores.operacion = 'Elige venta o alquiler.';

		const precio = Number(valores.precio);
		if (!valores.precio || !Number.isFinite(precio) || precio <= 0)
			errores.precio = 'El precio debe ser un número mayor que 0.';

		const dormitorios = esTerreno ? 0 : Number(valores.dormitorios);
		if (
			!esTerreno &&
			(!valores.dormitorios ||
				!Number.isInteger(dormitorios) ||
				dormitorios < 0 ||
				dormitorios > 20)
		)
			errores.dormitorios = 'Indica entre 0 y 20 dormitorios.';

		const banos = esTerreno ? 0 : Number(valores.banos);
		if (!esTerreno && (!Number.isInteger(banos) || banos < 1 || banos > 20))
			errores.banos = 'Indica entre 1 y 20 baños.';

		const areaM2 = Number(valores.areaM2);
		if (!Number.isFinite(areaM2) || areaM2 < 10) errores.areaM2 = 'La superficie mínima es 10 m².';

		// El número de autos solo se valida si el cliente marcó que tiene garaje
		const conGaraje = valores.tieneGaraje && !esTerreno;
		const garajeAutos = conGaraje ? Number(valores.garajeAutos) : 0;
		if (conGaraje && (!Number.isInteger(garajeAutos) || garajeAutos < 1 || garajeAutos > 10))
			errores.garajeAutos = 'Indica para cuántos autos es el garaje (de 1 a 10).';

		if (valores.descripcion.length < 20)
			errores.descripcion = 'La descripción debe tener al menos 20 caracteres.';

		if (Object.keys(errores).length > 0) {
			// 400 Bad Request: la página recibe los errores y los valores en `form` (ActionData)
			return fail(400, { errores, valores });
		}

		// ---- Datos válidos: se guardan en memoria ----
		const solicitud = crearSolicitud({
			clienteNombre: valores.clienteNombre,
			clienteEmail: valores.clienteEmail.toLowerCase(),
			tipo: valores.tipo as TipoInmueble,
			direccion: valores.direccion,
			ciudad: valores.ciudad,
			departamento: valores.departamento as Departamento,
			precio,
			operacion: valores.operacion as 'venta' | 'alquiler',
			dormitorios,
			banos,
			areaM2,
			garajeAutos,
			caracteristicas: valores.caracteristicas
				.split(',')
				.map((c) => c.trim())
				.filter(Boolean),
			descripcion: valores.descripcion
		});

		return { exito: true, solicitudId: solicitud.id };
	}
} satisfies Actions;
