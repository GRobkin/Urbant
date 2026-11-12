import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /login  →  por ahora solo valida los campos.
// El inicio de sesión real (Supabase Auth) se conecta en la próxima etapa.
export const actions = {
	default: async ({ request }) => {
		const datos = await request.formData();
		const email = String(datos.get('email') ?? '').trim();
		const password = String(datos.get('password') ?? '');

		const errores: { email?: string; password?: string } = {};
		if (!EMAIL_VALIDO.test(email)) errores.email = 'Ingresa un email válido.';
		if (!password) errores.password = 'Ingresa tu contraseña.';

		if (Object.keys(errores).length > 0) {
			return fail(400, { email, errores });
		}

		return { email, pendiente: true };
	}
} satisfies Actions;
