import type { PageServerLoad } from './$types';
import { listarCasas } from '#lib/server/datos.ts';
import type { FiltrosCatalogo, TipoInmueble } from '#lib/types.ts';
import { esDepartamento } from '#lib/uruguay.ts';

/** Convierte un parámetro de la URL en número; devuelve undefined si está vacío o no es válido. */
function aNumero(valor: string | null): number | undefined {
	if (!valor) return undefined;
	const n = Number(valor);
	return Number.isFinite(n) && n >= 0 ? n : undefined;
}

const TIPOS: TipoInmueble[] = ['casa', 'apartamento', 'terreno'];

// GET /catalogo?tipo=casa&operacion=venta&departamento=Maldonado&precioMin=...&precioMax=...&dormitorios=...&garaje=si
export const load: PageServerLoad = ({ url }) => {
	const p = url.searchParams;
	const operacion = p.get('operacion');
	const tipo = TIPOS.find((t) => t === p.get('tipo'));
	const departamento = p.get('departamento');

	const filtros: FiltrosCatalogo = {
		tipo,
		operacion: operacion === 'venta' || operacion === 'alquiler' ? operacion : undefined,
		departamento: esDepartamento(departamento) ? departamento : undefined,
		precioMin: aNumero(p.get('precioMin')),
		precioMax: aNumero(p.get('precioMax')),
		dormitorios: aNumero(p.get('dormitorios')),
		conGaraje: p.get('garaje') === 'si' || undefined
	};

	return {
		casas: listarCasas(filtros),
		filtros
	};
};
