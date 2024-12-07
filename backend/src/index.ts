import express from 'express';
import cors from 'cors';
import { config } from './config';
import { generatePanelPrompts } from './llm';
import { generateImage } from './imageGeneration';
import { presets } from './presets';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/generate-comic', async (req, res) => {
  try {
    const { prompt, style, panels, captions, dialogue } = req.body;
    
    console.log('Received request:', { prompt, style, panels, captions, dialogue });

    // Convert panels to number
    const panelCount = parseInt(panels, 10);

    if (isNaN(panelCount) || panelCount < 1 || panelCount > 4) {
      return res.status(400).json({ error: 'Invalid panel count. Must be between 1 and 4.' });
    }

    const preset = presets[style] || presets.neutral;

    const panelPrompts = await generatePanelPrompts(prompt, panelCount);
    console.log('Generated panel prompts:', panelPrompts);

    const images: string[] = [];
    for (let i = 0; i < panelPrompts.length; i++) {
      console.log(`Generating image ${i + 1}/${panelPrompts.length}`);
      let panelPrompt = panelPrompts[i];
      
      // Add captions and dialogue information if needed
      if (captions) {
        panelPrompt += ", with captions";
      }
      if (dialogue) {
        panelPrompt += ", include dialogue bubbles";
      }

      const image = await generateImage(panelPrompt, preset);
      images.push(image);
    }

    // Generate a unique job ID
    const jobId = Date.now().toString();

    res.json({ jobId, panelPrompts, images });
  } catch (error) {
    console.error('Error in /generate-comic:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Internal server error', details: errorMessage });
  }
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});