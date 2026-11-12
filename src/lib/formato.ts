import type { EstadoCasa, TipoInmueble, TipoOperacion } from '#lib/types.ts';

const moneda = new Intl.NumberFormat('es-UY', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

/** Precio en dólares; si es alquiler agrega 'por mes'. */
export function formatearPrecio(precio: number, operacion?: TipoOperacion): string {
	return moneda.format(precio) + (operacion === 'alquiler' ? ' por mes' : '');
}

/** Ciudad y departamento, sin repetir cuando coinciden ("Montevideo"). */
export function ubicacion(ciudad: string, departamento: string): string {
	return ciudad === departamento ? ciudad : `${ciudad}, ${departamento}`;
}

/** Pide la foto al tamaño justo que se va a mostrar. */
export function fotoEnTamano(url: string, ancho: number): string {
	return `${url}?auto=format&fit=crop&w=${ancho}&q=75`;
}

export const etiquetaTipo: Record<TipoInmueble, string> = {
	casa: 'Casa',
	apartamento: 'Apartamento',
	terreno: 'Terreno'
};

export const pluralTipo: Record<TipoInmueble, string> = {
	casa: 'Casas',
	apartamento: 'Apartamentos',
	terreno: 'Terrenos'
};

/** Ej.: "Apartamento en venta", "Casa en alquiler". */
export function tipoYOperacion(tipo: TipoInmueble, operacion: TipoOperacion): string {
	return `${etiquetaTipo[tipo]} en ${operacion}`;
}

export const etiquetaEstadoCasa: Record<EstadoCasa, string> = {
	disponible: 'Disponible',
	reservado: 'Reservada',
	vendido: 'Vendida o alquilada'
};
