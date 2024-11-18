export interface VoiceSynthesisConfig {
  model: string;
  modelFile: string;
  style: string;
  styleWeight: number;
  assistTextWeight: number;
  speed: number;
  noise: number;
  noisew: number;
  sdpRatio: number;
  language: string;
  silenceAfter: number;
  pitchScale: number;
  intonationScale: number;
  speaker: string;
}

export const defaultConfig: VoiceSynthesisConfig = {
  model: "Matsumura_v1",
  modelFile: "model_assets/Matsumura_v1/Matsumura_v1_e100_s1400.safetensors",
  style: "Neutral",
  styleWeight: 1,
  assistTextWeight: 1,
  speed: 1,
  noise: 0.6,
  noisew: 0.8,
  sdpRatio: 0.2,
  language: "JP",
  silenceAfter: 0.5,
  pitchScale: 1,
  intonationScale: 1,
  speaker: "Matsumura_v1"
};