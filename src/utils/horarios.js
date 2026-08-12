import dayjs from 'dayjs';

export function makeHorario() {
  return {
    id: crypto.randomUUID?.(),
    dias: [],
    duracion: null,
    inicio: dayjs().hour(9).minute(0),
    fin: dayjs().hour(12).minute(0),
  };
}
