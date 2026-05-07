export interface Usuario {
  id: number;
  nombre_completo: string;
  email: string;
  contrasena: string;
  rol: string;
  fecha_registro: string;
}
export interface Paciente {
  id: number;
  nombre_completo: string;
  edad: number;
  sexo: string;
  telefono: string;
  direccion: string;
  fecha_registro?: string;
  usuario_id: number;
  peso_actual: number;
  peso_usual: number;
  talla: number;
  circunferencia_cintura: number;
  ind_masa_corporal: number;
  clasificacion_imc?: string;
  clasificacion_circunferencia?:string;
}
export interface HerramientaMust {
  id?: number;
  id_paciente: number;
  imc: number;
  puntaje_imc: number;
  perdida_peso_porcentaje: number;
  puntaje_perdida_peso: number;
  efecto_enfermedad: boolean;
  puntaje_efecto_enfermedad: number;
  puntaje_total: number;
  clasificacion_riesgo: string;
  recomendaciones: string;
  fecha_evaluacion?: string;
}

export type HerramientaMustCreate = Omit<HerramientaMust, "id" | "fecha_evaluacion">;



export interface FrecuenciaConsumoAlimentos {
  id: number;
  id_paciente: number;
  grupo_alimentos: string;
  alimento: string;
  consume_si: boolean;
  consume_no: boolean;
  consume_dia: boolean;
  frecuencia_dia: boolean;
  frecuencia_semana: boolean;
  frecuencia_mes: boolean;
  clasificacion_poco_frecuente: boolean;
  clasificacion_frecuente: boolean;
  clasificacion_muy_frecuente: boolean;
}
export interface AntecedentePatologico {
  id?: number; // opcional en la creación, pero presente en lecturas
  id_paciente: number;
  hipertension_personal: boolean;
  hipercolesterolemia_personal: boolean;
  diabetes_personal: boolean;
  hipertrigliceridemia_personal: boolean;
  obesidad_personal: boolean;
  enfermedad_cardiovascular_personal: boolean;
  enfermedad_renal_personal: boolean;
  enfermedad_gastrointestinal_personal: boolean;
  hipertension_familiar: boolean;
  hipercolesterolemia_familiar: boolean;
  diabetes_familiar: boolean;
  hipertrigliceridemia_familiar: boolean;
  obesidad_familiar: boolean;
  enfermedad_cardiovascular_familiar: boolean;
  enfermedad_renal_familiar: boolean;
  enfermedad_gastrointestinal_familiar: boolean;
  quirurgicos: string;
}
export interface CircunstanciaAmbiental {
  id?: number;
  id_paciente: number;
  acalasia: boolean;
  alcoholismo: boolean;
  esclerosis_lateral_amiotrofica: boolean;
  demencia: boolean;
  abuso_drogas: boolean;
  trastornos_alimentacion: boolean;
  sindrome_guillain_barre: boolean;
  desordenes_mentales: boolean;
  distrofias_musculares: boolean;
  dolor: boolean;
  anemia_falciforme: boolean;
  limitaciones_economicas: boolean;
}

export interface ExamenFisico {
  id: number;
  id_paciente: number;
  petequias: boolean;
  dermatitis: boolean;
  pelagra: boolean;
  dermatitis_pintura_escamosa: boolean;
  xerosis: boolean;
  palidez: boolean;
  no_curacion_heridas: boolean;
  coiloniquia: boolean;
  linea_transversal_beau: boolean;
  plato_una_palido: boolean;
  pobre_salud_plato_una: boolean;
  unas_escamosas: boolean;
  alopecia: boolean;
  aclaramiento_pelo: boolean;
  pelo_sacacorchos: boolean;
  seborrea_nasolabial: boolean;
  manchas_bitot: boolean;
  keratomalacia: boolean;
  conjuntiva_palida: boolean;
  queilosis: boolean;
  estomatitis_angular: boolean;
  encias_esponjosas_sangrantes: boolean;
  lesiones_boca: boolean;
  encias_palidas: boolean;
  glositis: boolean;
  tiroides_agrandada: boolean;
}

export interface ExamenBioquimico {
  id: number;
  id_paciente: number;
  hemoglobina_glicada: number;
  glicemia_basal: number;
  colesterol_total: number;
  colesterol_hdl: number;
  colesterol_ldl: number;
  trigliceridos: number;
  creatinina: number;
  interpretacion_hemoglobina: string;
  interpretacion_glicemia: string;
  interpretacion_colesterol_total: string;
  interpretacion_colesterol_hdl: string;
  interpretacion_colesterol_ldl: string;
  interpretacion_trigliceridos: string;
  interpretacion_creatinina: string;
}



export interface DatosAlimentarios {
  id?: number;
  paciente_id: number;
  intolerancia_alimentos: boolean;
  alimentos_intolerancia: string;
  consumo_variable_emocional: boolean;
  come_tiempo_comida: boolean;
  frecuencia_comida: string;
  problemas_digestivos: boolean;
  tipo_problema_digestivo: string;
  consume_medicamentos: boolean;
  lista_medicamentos: string;
  toma_suplementos: boolean;
  agrega_sal: boolean;
  alimentos_no_agradan: string;
  alimentos_agradan: string;
}





export interface R24 {
  id?: number;
  id_paciente: number;
  fecha: string;
  observaciones?: string;
}

export interface R24Detalle {
  id?: number;
  id_r24: number;
  tiempo_comida: string;
  lugar?: string;
  hora?: string;
  preparacion?: string;
  alimento_id?: number;
  medida_casera?: string;
  gramos_consumidos?: number;
}

