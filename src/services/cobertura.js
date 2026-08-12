export const getPlanesMedicos = async () =>
  ['210', '310', '410', '510'].map((plan) => ({ id: plan, plan }));
