import { useState, useEffect, useCallback } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import LoadingOverlay from '../common/LoadingOverlay';
import ButtonsSection from '../common/forms/FormActions';
import ErrorSnackbar from '../common/ErrorSnackbar';
import SuccessSnackbar from '../common/SuccessSnackbar';
import { useFormValidation } from '../../hooks/useFormValidation';
import { createAfiliado } from '../../services/afiliado';
import { sleepIfLocal } from '../../utils/sleepIfLocal';

import {
  useNavigateToListado,
  useNavigateToEdicion,
} from '../../hooks/navigation';

import DatosPersonales from './DatosPersonales';
import { validateAltaAfiliado } from '../../utils/validations/validateAltaAfiliado';
import { getTiposDocumento } from '../../services/tipoDocumento';
import { handleArrayChange } from '../../utils/handleArrayChanges';
import dayjs from 'dayjs';
import Cobertura from './Cobertura';
import { getPlanesMedicos } from '../../services/cobertura';
import { getSituacionesTerapeuticas } from '../../services/situacionesTerapeuticas';
import FechaVigenciaGroup from './FechaVigenciaGroup';
import SituacionesTerapeuticasSection from './SituacionesTerapeuticasSection';
import DatosDeContacto from '../common/DatosDeContacto';
import { newDireccion } from '../../utils/afiliados';
import DireccionAfiliadoSection from './DireccionAfiliadoSection';
import GrupoFamiliarSection from './GrupoFamiliarSection';
import { useFormValidationContext } from '../../context/FormValidationContext';

const initialAfiliadoData = {
  tipoDocumento: null,
  numeroDocumento: '',
  fechaNacimiento: null,
  nombre: '',
  apellido: '',
  cobertura: null,
  vigenciaInicio: dayjs(),
  tieneFechaBaja: false,
  vigenciaFin: null,
  emails: [
    /*newEmail()*/
  ],
  telefonos: [
    /*newTelefono()*/
  ],
  direcciones: [newDireccion()],
  tieneSituacionTerapeutica: false,
  situacionesTerapeuticas: [
    /*newSituacionTerapeutica()*/
  ],

  tieneGrupoFamiliar: false,
  grupoFamiliar: [],
};

export default function AltaAfiliadoForm() {
  const navigateToEdicion = useNavigateToEdicion();
  const navigateToListado = useNavigateToListado();

  const [afiliadoData, setAfiliadoData] = useState(initialAfiliadoData);
  const [listaTiposDocumento, setListaTiposDocumento] = useState([]);
  const [listaPlanesMedicos, setListaPlanesMedicos] = useState([]);
  const [listaSituaciones, setListaSituaciones] = useState([]);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { validateBeforeSave } = useFormValidation(validateAltaAfiliado);
  const { setValidationError, clearErrors } = useFormValidationContext();

  useEffect(() => {
    const cargarListasIniciales = async () => {
      try {
        const [dataTipos, dataPlanes, dataSituaciones] = await Promise.all([
          getTiposDocumento(),
          getPlanesMedicos(),
          getSituacionesTerapeuticas(),
        ]);

        setListaTiposDocumento(dataTipos);
        setListaPlanesMedicos(dataPlanes);
        setListaSituaciones(dataSituaciones);
      } catch (err) {
        console.error('Error al obtener datos iniciales:', err);
      } finally {
        setLoading(false);
      }
    };
    cargarListasIniciales();
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { name, value, type, checked } = event.target;

      const newValue = type === 'checkbox' ? checked : value;

      setAfiliadoData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));

      clearErrors(name);
    },
    [clearErrors]
  );

  const handleGeneralChange = handleArrayChange(setAfiliadoData);

  const handleGuardar = () => {
    const dataToValidate = {
      ...afiliadoData,
      vigenciaInicio: afiliadoData.vigenciaInicio?.toDate?.(),
      vigenciaFin: afiliadoData.vigenciaFin?.toDate?.(),
    };

    validateBeforeSave(dataToValidate, async () => {
      try {
        setSaving(true);
        await sleepIfLocal(1500);

        const data = await createAfiliado(afiliadoData);

        navigateToEdicion(data.id, { created: true });
      } catch (err) {
        console.error('Error al guardar el afiliado:', err);

        const errorMessage = err.response?.data?.message || err.message;
        const statusCode = err.response?.status;

        if (handleBackendError(errorMessage, statusCode)) {
          setShowError(false);
        } else {
          setShowError(true);
        }
      } finally {
        setSaving(false);
      }
    });
  };

  const handleBackendError = (errorMessage, statusCode) => {
    // Error de documento duplicado
    if (errorMessage.includes('ya está registrado') || statusCode === 400) {
      if (errorMessage.includes('miembro')) {
        setValidationError('grupoFamiliar-0-numeroDocumento', errorMessage);

        const grupoFamiliarSection = document.querySelector(
          '[data-section="grupo-familiar"]'
        );
        if (grupoFamiliarSection) {
          grupoFamiliarSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
        return true;
      } else {
        setValidationError('numeroDocumento', errorMessage);
        const campoDocumento = document.querySelector(
          '[name="numeroDocumento"]'
        );
        if (campoDocumento) {
          campoDocumento.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          campoDocumento.focus();
        }
        return true;
      }
    }
    return false;
  };

  const handleCancelar = useCallback(
    () => navigateToListado('alta-cancelada'),
    [navigateToListado]
  );

  return (
    <Box component="form" noValidate>
      <LoadingOverlay open={saving || loading} />

      <DatosPersonales
        afiliadoData={afiliadoData}
        onChange={handleChange}
        onAutocompleteChange={handleGeneralChange}
        listaTiposDocumento={listaTiposDocumento}
      />

      <Divider sx={{ my: 4 }} />

      <Cobertura
        afiliadoData={afiliadoData}
        onAutocompleteChange={handleGeneralChange}
        listaPlanesMedicos={listaPlanesMedicos}
      />

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
          Vigencia
        </Typography>
        <FechaVigenciaGroup
          data={afiliadoData}
          onDateChange={handleGeneralChange}
          onSwitchChange={handleChange}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <SituacionesTerapeuticasSection
        afiliadoData={afiliadoData}
        onSwitchChange={handleChange}
        onArrayChange={handleGeneralChange}
        listaSituaciones={listaSituaciones}
      />

      <Divider sx={{ my: 4 }} />

      <DatosDeContacto
        contactoData={afiliadoData}
        handleArray={handleGeneralChange}
      />

      <Divider sx={{ my: 4 }} />

      <DireccionAfiliadoSection
        direcciones={afiliadoData.direcciones}
        onChange={handleGeneralChange}
      />

      <Divider sx={{ my: 4 }} />

      <GrupoFamiliarSection
        afiliadoData={afiliadoData}
        onSwitchChange={handleChange}
        onArrayChange={handleGeneralChange}
        listaTiposDocumento={listaTiposDocumento}
        listaSituaciones={listaSituaciones}
      />

      <Divider sx={{ my: 4 }} />

      <ButtonsSection
        handleGuardar={handleGuardar}
        onConfirmCancel={handleCancelar}
        cancelTitle="¿Cancelar alta de afiliado?"
        cancelMessage="Si cancelás ahora, se perderán los datos ingresados."
      />

      <ErrorSnackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        message="Ocurrió un error al guardar el afiliado. Por favor, revisa los campos."
      />

      <SuccessSnackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        message="Afiliado creado exitosamente."
      />
    </Box>
  );
}
