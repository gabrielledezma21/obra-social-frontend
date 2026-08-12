import PropTypes from 'prop-types';
import AgregarButton from '../../common/forms/AgregarButton';
import LugarAtencionItem from './LugarAtencionItem';

export default function LugarAtencionList({
  centros,
  provincias,
  onChange,
  validationError,
  errorRefMap,
}) {
  const updateOne = (id, nuevo) => {
    onChange(centros.map((c) => (c.id === id ? nuevo : c)));
  };

  const deleteOne = (id) => {
    onChange(centros.filter((c) => c.id !== id));
  };

  const addOne = () => {
    onChange([
      ...centros,
      {
        id: crypto.randomUUID(),
        direccion: {
          calle: '',
          altura: '',
          pisoDepto: '',
          localidad: '',
          provincia: null,
        },
        horarios: [
          {
            id: crypto.randomUUID(),
            dias: [],
            horaInicio: '',
            horaFin: '',
          },
        ],
      },
    ]);
  };

  return (
    <>
      {centros.map((c, i) => (
        <LugarAtencionItem
          key={c.id}
          centro={c}
          provincias={provincias}
          index={i}
          total={centros.length}
          onUpdate={(nuevo) => updateOne(c.id, nuevo)}
          onDelete={() => deleteOne(c.id)}
          validationError={validationError}
          errorRefMap={errorRefMap}
        />
      ))}

      <AgregarButton onAgregar={addOne} label="Agregar centro de atención" />
    </>
  );
}

LugarAtencionList.propTypes = {
  centros: PropTypes.array.isRequired,
  provincias: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  validationError: PropTypes.object,
  errorRefMap: PropTypes.object,
};
