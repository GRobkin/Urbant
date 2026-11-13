// "Base de datos" simulada en memoria.
// Los datos viven mientras el servidor esté encendido; al reiniciar vuelven a estos valores.
// Al estar dentro de una carpeta /server/, SvelteKit impide importarlo desde el cliente.

import type { Casa, DatosPropiedad, FiltrosCatalogo, Solicitud } from '#lib/types.ts';

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

const casas: Casa[] = [
	{
		id: 1,
		solicitudId: null,
		foto: unsplash('1502672260266-1c1ef2d93688'),
		tipo: 'apartamento',
		direccion: 'Av. Brasil 2450',
		ciudad: 'Montevideo',
		departamento: 'Montevideo',
		precio: 285000,
		operacion: 'venta',
		dormitorios: 3,
		banos: 2,
		areaM2: 120,
		garajeAutos: 1,
		caracteristicas: ['Balcón', 'Calefacción'],
		descripcion: 'Apartamento luminoso a dos cuadras de la rambla, con vista despejada.',
		estado: 'disponible',
		publicadaEn: '2026-09-02T10:00:00.000Z'
	},
	{
		id: 2,
		solicitudId: null,
		foto: unsplash('1613490493576-7fde63acd811'),
		tipo: 'casa',
		direccion: 'Calle 20 n.º 1180',
		ciudad: 'Punta del Este',
		departamento: 'Maldonado',
		precio: 1800,
		operacion: 'alquiler',
		dormitorios: 2,
		banos: 1,
		areaM2: 75,
		garajeAutos: 0,
		caracteristicas: ['Piscina', 'Amueblado'],
		descripcion: 'Casa de verano cerca de la playa Brava, ideal para familias.',
		estado: 'disponible',
		publicadaEn: '2026-09-15T14:30:00.000Z'
	},
	{
		id: 3,
		solicitudId: null,
		foto: unsplash('1522708323590-d24dbb6b0267'),
		tipo: 'apartamento',
		direccion: 'Rivera 3321',
		ciudad: 'Montevideo',
		departamento: 'Montevideo',
		precio: 950,
		operacion: 'alquiler',
		dormitorios: 1,
		banos: 1,
		areaM2: 45,
		garajeAutos: 0,
		caracteristicas: ['Portería', 'Ascensor'],
		descripcion: 'Monoambiente amplio, ideal para estudiantes o parejas.',
		estado: 'reservado',
		publicadaEn: '2026-10-01T09:15:00.000Z'
	},
	{
		id: 4,
		solicitudId: null,
		foto: unsplash('1570129477492-45c003edd2be'),
		tipo: 'casa',
		direccion: 'Gral. Flores 455',
		ciudad: 'Colonia del Sacramento',
		departamento: 'Colonia',
		precio: 198000,
		operacion: 'venta',
		dormitorios: 4,
		banos: 3,
		areaM2: 210,
		garajeAutos: 2,
		caracteristicas: ['Jardín', 'Parrillero'],
		descripcion: 'Casa colonial restaurada en el barrio histórico, con patio arbolado.',
		estado: 'disponible',
		publicadaEn: '2026-10-20T16:45:00.000Z'
	},
	{
		id: 5,
		solicitudId: null,
		foto: unsplash('1500382017468-9049fed747ef'),
		tipo: 'terreno',
		direccion: 'Camino de los Horneros km 3',
		ciudad: 'Colonia del Sacramento',
		departamento: 'Colonia',
		precio: 65000,
		operacion: 'venta',
		dormitorios: 0,
		banos: 0,
		areaM2: 1200,
		garajeAutos: 0,
		caracteristicas: ['Luz y agua en la puerta', 'Apto para construir'],
		descripcion: 'Terreno llano rodeado de campo, a diez minutos del centro histórico.',
		estado: 'disponible',
		publicadaEn: '2026-10-28T11:00:00.000Z'
	}
];

const solicitudes: Solicitud[] = [
	{
		id: 1,
		clienteNombre: 'Ana Pereira',
		clienteEmail: 'ana@ejemplo.com',
		tipo: 'apartamento',
		direccion: 'Bvar. Artigas 1500',
		ciudad: 'Montevideo',
		departamento: 'Montevideo',
		precio: 320000,
		operacion: 'venta',
		dormitorios: 3,
		banos: 2,
		areaM2: 140,
		garajeAutos: 1,
		caracteristicas: ['Terraza'],
		descripcion: 'Penthouse con terraza propia y parrillero.',
		estado: 'pendiente',
		motivoRechazo: null,
		creadaEn: '2026-11-05T12:00:00.000Z'
	},
	{
		id: 2,
		clienteNombre: 'Carlos Méndez',
		clienteEmail: 'carlos@ejemplo.com',
		tipo: 'casa',
		direccion: 'Uruguay 870',
		ciudad: 'Salto',
		departamento: 'Salto',
		precio: 600,
		operacion: 'alquiler',
		dormitorios: 2,
		banos: 1,
		areaM2: 60,
		garajeAutos: 0,
		caracteristicas: ['Patio'],
		descripcion: 'Casa sencilla cerca del centro.',
		estado: 'rechazada',
		motivoRechazo: 'Faltan fotos y el título de propiedad.',
		creadaEn: '2026-11-01T08:30:00.000Z'
	}
];

let siguienteIdSolicitud = solicitudes.length + 1;

// ---------- Casas (catálogo) ----------

export function listarCasas(filtros: FiltrosCatalogo = {}): Casa[] {
	return casas.filter(
		(c) =>
			(!filtros.tipo || c.tipo === filtros.tipo) &&
			(!filtros.operacion || c.operacion === filtros.operacion) &&
			(!filtros.departamento || c.departamento === filtros.departamento) &&
			(filtros.precioMin === undefined || c.precio >= filtros.precioMin) &&
			(filtros.precioMax === undefined || c.precio <= filtros.precioMax) &&
			(filtros.dormitorios === undefined || c.dormitorios >= filtros.dormitorios) &&
			(!filtros.conGaraje || c.garajeAutos > 0)
	);
}

// ---------- Solicitudes ----------

export function crearSolicitud(
	datos: DatosPropiedad & { clienteNombre: string; clienteEmail: string }
): Solicitud {
	const nueva: Solicitud = {
		...datos,
		id: siguienteIdSolicitud++,
		estado: 'pendiente',
		motivoRechazo: null,
		creadaEn: new Date().toISOString()
	};
	solicitudes.push(nueva);
	return nueva;
}
