import { config } from './config';
import { Preset } from './presets';

export async function generateImage(prompt: string, preset: Preset): Promise<string> {
  try {
    const imagePrompt = preset.imagePrompt(prompt).join(", ");
    console.log('Generating image with prompt:', imagePrompt);

    const response = await fetch(`https://api-inference.huggingface.co/models/${config.renderingBaseModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.hfApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: imagePrompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image generation API error:', response.status, errorText);
      throw new Error(`Failed to generate image: ${response.status} ${response.statusText}. Response: ${errorText}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
  } catch (error) {
    console.error('Error in generateImage:', error);
    throw error;
  }
}