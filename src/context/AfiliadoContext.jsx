import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  getAfiliadoById,
  updateAfiliadoDatosPersonales,
  updateAfiliadoCobertura,
  deleteAfiliadoById,
  updateAfiliadoDatosContacto,
  updateAfiliadoDirecciones,
  addDependiente,
  modificarFechaBajaAfiliado,
  reincorporarAfiliado,
} from '../services/afiliado';
import SuccessSnackbar from '../components/common/SuccessSnackbar';
import ErrorSnackbar from '../components/common/ErrorSnackbar';
import { Backdrop, CircularProgress } from '@mui/material';

const AfiliadoContext = createContext();

export function AfiliadoProvider({ idAfiliado, afiliadoData, children }) {
  const [afiliado, setAfiliado] = useState(afiliadoData || null);
  const [loading, setLoading] = useState(!afiliadoData);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAfiliado = useCallback(async () => {
    try {
      const data = await getAfiliadoById(idAfiliado);
      setAfiliado(data);
      return data;
    } catch {
      setError('No se pudo cargar el afiliado.');
      throw new Error();
    } finally {
      setLoading(false);
    }
  }, [idAfiliado]);

  useEffect(() => {
    if (afiliadoData) {
      setAfiliado(afiliadoData);
      setLoading(false);
      return;
    }

    fetchAfiliado();
  }, [afiliadoData, fetchAfiliado]);

  const finishWithMessage = ({ success, error }) => {
    if (success) setSuccessMessage(success);
    if (error) setError(error);
    setGlobalLoading(false);
  };

  const updateDatosPersonales = async (data) => {
    if (!afiliado?.id) return;
    setGlobalLoading(true);

    const payload = {
      tipoDocumentoId: data.tipoDocumentoId,
      numeroDocumento: data.numeroDocumento,
      fechaNacimiento: data.fechaNacimiento,
      nombre: data.nombre,
      apellido: data.apellido,
      vigenciaInicio: data.vigenciaInicio,
      vigenciaFin: data.vigenciaFin,
      tieneFechaBaja: data.tieneFechaBaja,
    };

    try {
      await updateAfiliadoDatosPersonales(afiliado.id, payload);
      const updated = await fetchAfiliado();
      finishWithMessage({ success: 'Datos personales actualizados con éxito' });
      return updated;
    } catch {
      finishWithMessage({
        error: 'No se pudieron actualizar los datos personales.',
      });
    }
  };

  const updateCobertura = async (data) => {
    if (!afiliado?.id) return;
    setGlobalLoading(true);

    const payload = { planId: data.planId };

    try {
      await updateAfiliadoCobertura(afiliado.id, payload);
      const updated = await fetchAfiliado();
      finishWithMessage({ success: 'Cobertura actualizada con éxito' });
      return updated;
    } catch {
      finishWithMessage({
        error: 'No se pudo actualizar la cobertura.',
      });
    }
  };

  const updateDatosContacto = async (data) => {
    if (!afiliado?.id) return;
    setGlobalLoading(true);

    const payload = {
      emails: (data.emails || []).map((e) => ({
        direccion: e.direccion || e,
      })),
      telefonos: (data.telefonos || []).map((t) => ({
        numero: t.numero || t,
      })),
    };

    try {
      await updateAfiliadoDatosContacto(afiliado.id, payload);
      const updated = await fetchAfiliado();
      finishWithMessage({
        success: 'Datos de contacto actualizados con éxito',
      });
      return updated;
    } catch {
      finishWithMessage({
        error: 'No se pudieron actualizar los datos de contacto.',
      });
    }
  };

  const updateDirecciones = async (direccionesData) => {
    if (!afiliado?.id) return;
    setGlobalLoading(true);

    try {
      const direccionesPayload = direccionesData.map((direccionItem) => ({
        calle: direccionItem.calle,
        altura: String(direccionItem.altura),
        pisoDepto: direccionItem.pisoDepto || '',
        codigoPostal: direccionItem.codigoPostal,
        localidad: direccionItem.localidad,
        provinciaId: direccionItem.provincia?.id || direccionItem.provinciaId,
      }));

      const payload = { direcciones: direccionesPayload };

      await updateAfiliadoDirecciones(afiliado.id, payload);
      const updated = await fetchAfiliado();
      finishWithMessage({
        success: 'Direcciones actualizadas con éxito',
      });
      return updated;
    } catch {
      finishWithMessage({
        error: 'No se pudieron actualizar las direcciones.',
      });
    }
  };

  const darDeBaja = async (vigenciaFin) => {
    if (!afiliado?.id) return false;
    setGlobalLoading(true);

    try {
      await deleteAfiliadoById(afiliado.id, vigenciaFin);
      const updated = await fetchAfiliado();
      finishWithMessage({
        success: `Afiliado dado de baja exitosamente. Fecha de baja: ${vigenciaFin}`,
      });
      return { success: true, updated };
    } catch {
      finishWithMessage({ error: 'No se pudo dar de baja el afiliado.' });
      return { success: false };
    }
  };

  const agregarDependiente = async (dependienteData) => {
    if (!afiliado?.id) return;
    setGlobalLoading(true);

    try {
      await addDependiente(afiliado.id, dependienteData);
      const updated = await fetchAfiliado();
      finishWithMessage({ success: 'Miembro agregado con éxito' });
      return updated;
    } catch {
      finishWithMessage({
        error: 'No se puedo agregar el miembro al grupo familiar.',
      });
    }
  };

  const modificarFechaBaja = async (
    fechaBaja,
    aplicarAGrupoFamiliar = false
  ) => {
    if (!afiliado?.id) return false;
    setGlobalLoading(true);

    try {
      await modificarFechaBajaAfiliado(
        afiliado.id,
        fechaBaja,
        aplicarAGrupoFamiliar
      );
      const updated = await fetchAfiliado();
      finishWithMessage({
        success: `Fecha de baja modificada exitosamente${aplicarAGrupoFamiliar ? ' para todo el grupo familiar' : ''}`,
      });
      return { success: true, updated };
    } catch {
      finishWithMessage({ error: 'No se pudo modificar la fecha de baja.' });
      return { success: false };
    }
  };

  const reincorporar = async (reincorporarGrupoFamiliar = false) => {
    if (!afiliado?.id) return false;
    setGlobalLoading(true);

    try {
      await reincorporarAfiliado(afiliado.id, reincorporarGrupoFamiliar);
      const updated = await fetchAfiliado();
      finishWithMessage({
        success: `Afiliado reincorporado exitosamente${reincorporarGrupoFamiliar ? ' junto con su grupo familiar' : ''}`,
      });
      return { success: true, updated };
    } catch {
      finishWithMessage({ error: 'No se pudo reincorporar el afiliado.' });
      return { success: false };
    }
  };

  return (
    <AfiliadoContext.Provider
      value={{
        afiliado,
        loading,
        error,
        globalLoading,
        successMessage,
        setSuccessMessage,
        updateDatosPersonales,
        updateCobertura,
        updateDatosContacto,
        updateDirecciones,
        darDeBaja,
        agregarDependiente,
        modificarFechaBaja,
        reincorporar,
        refetchAfiliado: fetchAfiliado,
        clearError: () => setError(null),
      }}
    >
      {children}

      <Backdrop open={globalLoading} sx={{ zIndex: 2000, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <SuccessSnackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />

      <ErrorSnackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        message={error}
      />
    </AfiliadoContext.Provider>
  );
}

AfiliadoProvider.propTypes = {
  idAfiliado: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  afiliadoData: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export const useAfiliado = () => useContext(AfiliadoContext);
