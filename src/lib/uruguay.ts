// Los 19 departamentos de Uruguay: se puede publicar y buscar en cualquiera de ellos.
export const DEPARTAMENTOS = [
	'Artigas',
	'Canelones',
	'Cerro Largo',
	'Colonia',
	'Durazno',
	'Flores',
	'Florida',
	'Lavalleja',
	'Maldonado',
	'Montevideo',
	'Paysandú',
	'Río Negro',
	'Rivera',
	'Rocha',
	'Salto',
	'San José',
	'Soriano',
	'Tacuarembó',
	'Treinta y Tres'
] as const;

export type Departamento = (typeof DEPARTAMENTOS)[number];

export function esDepartamento(valor: string | null): valor is Departamento {
	return DEPARTAMENTOS.includes(valor as Departamento);
}
