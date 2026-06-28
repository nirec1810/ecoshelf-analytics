// PRINCIPIO SOLID APLICADO: Open/Closed Principle (OCP)
// ANTES: Los umbrales eran constantes hardcodeadas directamente en sugerencia.motor.ts:
//   const UMBRAL_DESPERDICIO = 0.20
//   const UMBRAL_DEMANDA     = 0.85
//
// PROBLEMA: Para cambiar esos valores (ej. afinar el motor por temporada o cliente)
// había que editar el código fuente del motor. El módulo estaba "abierto a modificación".
//
// AHORA: MotorConfig es una interfaz inyectable. El motor acepta configuración desde
// afuera sin que su lógica interna cambie. Está "cerrado para modificación, abierto
// para extensión" — se puede pasar una config distinta sin tocar el motor.
// ─────────────────────────────────────────────────────────────────────────────

export interface MotorConfig {
  umbralDesperdicio: number  
  umbralDemanda:     number   
}

export const CONFIG_DEFAULT: MotorConfig = {
  umbralDesperdicio: 0.20,  
  umbralDemanda:     0.80, 
}