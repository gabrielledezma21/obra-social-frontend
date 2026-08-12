import { useState, useEffect } from 'react';
import { Box, Divider } from '@mui/material';

import LoadingOverlay from '../common/LoadingOverlay';
import ButtonsSection from '../common/forms/FormActions';
import ErrorSnackbar from '../common/ErrorSnackbar';
import SuccessSnackbar from '../common/SuccessSnackbar';

import { useFormValidation } from '../../hooks/useFormValidation';
import { useFormValidationContext } from '../../context/FormValidationContext';

import { createPrestador } from '../../services/prestadores';
import { sleepIfLocal } from '../../utils/sleepIfLocal';

import {
  useNavigateToListado,
  useNavigateToEdicion,
} from '../../hooks/navigation';

import DatosPersonalesSection from './DatosPersonalesSection';
import DatosDeContacto from '../common/DatosDeContacto';
import EspecialidadesSection from './EspecialidadesSection';
import CentroAtencionSection from './CentroAtencionSection';

import { validateAltaPrestador } from '../../utils/validations/validateAltaPrestador';
import { handleArrayChange } from '../../utils/handleArrayChanges';
import { getEspecialidades } from '../../services/especialidades';
import { getCentrosMedicos } from '../../services/centrosMedicos';
import { newCentroDeAtencion } from '../../utils/prestadores';

function AltaPrestadorForm() {
  const navigateToEdicion = useNavigateToEdicion();
  const navigateToListado = useNavigateToListado();

  const [prestadorData, setPrestadorData] = useState({
    nombre: '',
    cuilCuit: '',
    esCentroMedico: false,
    integraCentroMedico: false,
    centroMedicoQueIntegra: null,
    especialidades: [],
    emails: [],
    telefonos: [],
    centrosDeAtencion: [newCentroDeAtencion()],
  });

  const [listaEspecialidades, setListaEspecialidades] = useState([]);
  const [listaCentrosMedicos, setListaCentrosMedicos] = useState([]);

  const [saving, setSaving] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { validateBeforeSave } = useFormValidation(validateAltaPrestador);
  const { setValidationError } = useFormValidationContext();

  useEffect(() => {
    const cargarDataInicial = async () => {
      try {
        const [especialidades, centros] = await Promise.all([
          getEspecialidades(),
          getCentrosMedicos(),
        ]);
        setListaEspecialidades(especialidades);
        setListaCentrosMedicos(centros);
      } catch (err) {
        console.error('Error cargando datos iniciales: ', err);
      }
    };
    cargarDataInicial();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPrestadorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArray = handleArrayChange(setPrestadorData);

  const handleSwitchChange = (field) => (event) => {
    const checked = event.target.checked;

    setPrestadorData((prev) => {
      const updated = { ...prev, [field]: checked };

      if (field === 'esCentroMedico' && checked) {
        updated.integraCentroMedico = false;
        updated.centroMedicoQueIntegra = null;
      }

      if (field === 'integraCentroMedico' && !checked) {
        updated.centroMedicoQueIntegra = null;
      }

      return updated;
    });
  };

  const handleCentroMedicoChange = (id) => {
    setPrestadorData((prev) => ({
      ...prev,
      centroMedicoQueIntegra: id,
    }));
  };

  const handleBackendCuilError = (errorMessage) => {
    if (
      errorMessage.includes('CUIL') ||
      errorMessage.includes('C.U.I.L') ||
      errorMessage.includes('ya está registrado')
    ) {
      const mensajePersonalizado =
        'Este CUIL/CUIT ya está registrado. Verificá los datos ingresados.';

      setValidationError('cuilCuit', mensajePersonalizado);

      const campo = document.querySelector('[name="cuilCuit"]');
      if (campo) {
        campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        campo.focus();
      }

      return true;
    }

    return false;
  };

  const handleGuardar = () => {
    const payload = {
      nombre: prestadorData.nombre,
      cuilCuit: prestadorData.cuilCuit,
      esCentroMedico: prestadorData.esCentroMedico,
      integraCentroMedico: prestadorData.integraCentroMedico,
      centroMedicoQueIntegra: prestadorData.centroMedicoQueIntegra,
      especialidades: prestadorData.especialidades.map((e) => e.id),
      emails: prestadorData.emails,
      telefonos: prestadorData.telefonos,
      lugaresAtencion: prestadorData.centrosDeAtencion.map((c) => ({
        calle: c.calle,
        altura: Number(c.altura) || null,
        codigoPostal: c.codigoPostal || '',
        localidad: c.localidad,
        provincia: c.provincia?.id || null,
        horarios: c.horarios.map((h) => ({
          horaInicio: h.inicio ? h.inicio.format('HH:mm') : null,
          horaFin: h.fin ? h.fin.format('HH:mm') : null,
          dias: (h.dias || []).map((d) =>
            typeof d === 'string' ? d : d.nombre
          ),
        })),
      })),
    };

    validateBeforeSave(prestadorData, async () => {
      try {
        setSaving(true);
        await sleepIfLocal(1000);

        const data = await createPrestador(payload);
        navigateToEdicion(data.id, { created: true });
      } catch (err) {
        const backendMsg = err?.response?.data || '';

        if (handleBackendCuilError(backendMsg)) {
          setSaving(false);
          return;
        }

        setShowError(true);
      } finally {
        setSaving(false);
      }
    });
  };

  const handleCancelar = () => navigateToListado('alta-cancelada');

  return (
    <Box component="form" noValidate>
      <LoadingOverlay open={saving} />

      <DatosPersonalesSection
        prestadorData={prestadorData}
        onChange={handleChange}
      />

      <DatosDeContacto contactoData={prestadorData} handleArray={handleArray} />

      <Divider sx={{ my: 4 }} />

      <EspecialidadesSection
        especialidades={prestadorData.especialidades}
        onChange={handleArray}
        listaEspecialidades={listaEspecialidades}
        listaCentrosMedicos={listaCentrosMedicos}
        isCentroMedico={prestadorData.esCentroMedico}
        integraCentroMedico={prestadorData.integraCentroMedico}
        centroMedicoId={prestadorData.centroMedicoQueIntegra}
        onSwitchChange={handleSwitchChange}
        onCentroMedicoChange={handleCentroMedicoChange}
      />

      <Divider sx={{ my: 4 }} />

      <CentroAtencionSection
        centros={prestadorData.centrosDeAtencion}
        onChange={(nuevos) =>
          setPrestadorData((prev) => ({
            ...prev,
            centrosDeAtencion: nuevos,
          }))
        }
      />

      <ButtonsSection
        handleGuardar={handleGuardar}
        onConfirmCancel={handleCancelar}
        cancelTitle="¿Cancelar alta de prestador?"
        cancelMessage="Si cancelás ahora, se perderán los datos ingresados."
      />

      <ErrorSnackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        message="Error al guardar el prestador"
      />

      <SuccessSnackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        message="Prestador creado exitosamente"
      />
    </Box>
  );
}

export default AltaPrestadorForm;
