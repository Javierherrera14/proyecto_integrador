import { create } from 'zustand';

interface PatientState {
  pacienteId: number | null;
  nombreCompleto: string | null;
  setPaciente: (id: number, nombre: string) => void;
  clearPaciente: () => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  pacienteId: null,
  nombreCompleto: null,
  setPaciente: (id, nombre) => set({ pacienteId: id, nombreCompleto: nombre }),
  clearPaciente: () => set({ pacienteId: null, nombreCompleto: null }),
}));
