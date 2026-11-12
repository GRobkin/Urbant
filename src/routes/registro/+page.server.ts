import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /registro  →  por ahora solo valida los campos.
// La creación real de la cuenta (Supabase Auth) se conecta en la próxima etapa.
export const actions = {
	default: async ({ request }) => {
		const datos = await request.formData();
		const nombre = String(datos.get('nombre') ?? '').trim();
		const email = String(datos.get('email') ?? '').trim();
		const password = String(datos.get('password') ?? '');
		const confirmacion = String(datos.get('confirmacion') ?? '');

		const errores: { nombre?: string; email?: string; password?: string; confirmacion?: string } =
			{};
		if (nombre.length < 3) errores.nombre = 'Ingresa tu nombre completo.';
		if (!EMAIL_VALIDO.test(email)) errores.email = 'Ingresa un email válido.';
		if (password.length < 8) errores.password = 'La contraseña debe tener al menos 8 caracteres.';
		if (confirmacion !== password) errores.confirmacion = 'Las contraseñas no coinciden.';

		if (Object.keys(errores).length > 0) {
			return fail(400, { nombre, email, errores });
		}

		return { nombre, email, pendiente: true };
	}
} satisfies Actions;
