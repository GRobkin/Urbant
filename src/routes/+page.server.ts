import type { PageServerLoad } from './$types';
import { listarCasas } from '#lib/server/datos.ts';

// GET /  →  inmuebles recién publicados
export const load: PageServerLoad = () => {
	const disponibles = listarCasas().filter((c) => c.estado === 'disponible');
	return {
		recientes: disponibles.slice(-3).reverse()
	};
};
