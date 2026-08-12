export const detailHeaderConfig = {
  'agenda-de-turnos': {
    title: (id) => `Agenda de turnos #${id}`,
    subtitle: () => `Detalles con opción de edición`,
    deleteService: 'deleteAgendaTurnos',
    redirectTo: '/agenda-turnos/listado?deleted=true',
    deleteModal: {
      title: 'Dar de baja agenda',
      message: (id) => `¿Estás seguro de dar de baja la agenda #${id}?`,
    },
  },

  prestador: {
    title: (_, nombre) => `Prestador: ${nombre}`,
    subtitle: () => `Detalles con opción de edición`,
    deleteService: 'deletePrestador',
    redirectTo: '/prestadores/listado?deleted=true',
    deleteModal: {
      title: 'Dar de baja prestador',
      message: (_, nombre) =>
        `¿Estás seguro de dar de baja al prestador ${nombre}? <br/> También <strong>se eliminarán las agendas de turno asociadas</strong>, si tiene.`,
    },
  },

  afiliado: {
    title: (_, nombre) => `Afiliado: ${nombre}`,
    subtitle: () => `Detalles con opción de edición`,
    deleteService: 'deleteAfiliado',
    redirectTo: '/afiliados/listado?deleted=true',
    deleteModal: {
      title: 'Dar de baja afiliado',
      message: (_, nombre) =>
        `¿Estás seguro de dar de baja al afiliado ${nombre}? <br/> También <strong>se darán de baja a los miembros de su grupo familiar</strong>, si tiene.`,
    },
  },
};
