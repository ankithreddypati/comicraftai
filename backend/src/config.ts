import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  hfApiToken: process.env.HF_API_TOKEN,
  llmModel: process.env.LLM_MODEL || 'HuggingFaceH4/zephyr-7b-beta',
  renderingBaseModel: process.env.RENDERING_BASE_MODEL,
};