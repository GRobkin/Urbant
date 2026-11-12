// Tipos compartidos entre servidor y cliente.
import type { Departamento } from '#lib/uruguay.ts';

// En la etapa 2 estos tipos van a reflejar las tablas de Supabase.

export type TipoInmueble = 'casa' | 'apartamento' | 'terreno';
export type TipoOperacion = 'venta' | 'alquiler';
export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada';
export type EstadoCasa = 'disponible' | 'reservado' | 'vendido';

/** Datos de una propiedad, comunes a la solicitud y a la casa publicada. */
export interface DatosPropiedad {
	tipo: TipoInmueble;
	direccion: string;
	/** Ciudad o localidad */
	ciudad: string;
	departamento: Departamento;
	precio: number;
	operacion: TipoOperacion;
	dormitorios: number;
	banos: number;
	areaM2: number;
	/** Cantidad de autos que entran en el garaje; 0 si no tiene garaje. */
	garajeAutos: number;
	caracteristicas: string[];
	descripcion: string;
}

/** Solicitud de publicación enviada por un cliente. */
export interface Solicitud extends DatosPropiedad {
	id: number;
	clienteNombre: string;
	clienteEmail: string;
	estado: EstadoSolicitud;
	motivoRechazo: string | null;
	creadaEn: string; // fecha ISO
}

/** Casa publicada en el catálogo (nace de una solicitud aprobada). */
export interface Casa extends DatosPropiedad {
	id: number;
	solicitudId: number | null;
	/** URL de la foto principal (en la etapa 2 vendrá de Supabase Storage). */
	foto: string;
	estado: EstadoCasa;
	publicadaEn: string; // fecha ISO
}

/** Filtros del catálogo público. */
export interface FiltrosCatalogo {
	tipo?: TipoInmueble;
	operacion?: TipoOperacion;
	departamento?: Departamento;
	precioMin?: number;
	precioMax?: number;
	dormitorios?: number;
	conGaraje?: boolean;
}
