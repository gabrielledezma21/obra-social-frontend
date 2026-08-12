import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { makeHorario } from '../utils/horarios';

const HorariosContext = createContext();

export function HorariosProvider({ children }) {
  const [horarios, setHorarios] = useState([makeHorario()]);

  const agregarHorario = () => setHorarios((prev) => [...prev, makeHorario()]);

  const eliminarHorario = (index) =>
    setHorarios((prev) => prev.filter((_, i) => i !== index));

  const actualizarHorario = (index, field, value) =>
    setHorarios((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );

  const resetHorarios = () => {
    setHorarios([makeHorario()]);
  };

  return (
    <HorariosContext.Provider
      value={{
        horarios,
        agregarHorario,
        eliminarHorario,
        actualizarHorario,
        resetHorarios,
      }}
    >
      {children}
    </HorariosContext.Provider>
  );
}

HorariosProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useHorarios = () => useContext(HorariosContext);
