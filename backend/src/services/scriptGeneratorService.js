import axios from 'axios';

// OpenAI API Service for script generation
export class ScriptGeneratorService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async generateScript(prompt, style = 'educational', language = 'en', duration = 300) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a professional video scriptwriter. Generate engaging, ${style} video scripts in ${language} language. Each scene should be separated by [SCENE]. Format: [SCENE] <number> <duration_seconds> <text>`,
            },
            {
              role: 'user',
              content: `Generate a ${duration}-second video script about: ${prompt}. Return as structured JSON with scenes array.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const scriptContent = response.data.choices[0].message.content;
      
      // Parse script into scenes
      const scenes = this.parseScript(scriptContent);
      
      return {
        success: true,
        script: scriptContent,
        scenes,
        duration,
      };
    } catch (error) {
      console.error('Script generation error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  parseScript(scriptContent) {
    // Parse script into scenes
    const scenePattern = /\[SCENE\]\s*(\d+)\s*(\d+)\s*(.+?)(?=\[SCENE\]|$)/gs;
    const scenes = [];
    let match;

    while ((match = scenePattern.exec(scriptContent)) !== null) {
      scenes.push({
        sceneNumber: parseInt(match[1]),
        duration: parseInt(match[2]),
        text: match[3].trim(),
        imagePrompt: `Scene ${match[1]}: ${match[3].substring(0, 100)}`,
      });
    }

    return scenes.length > 0 ? scenes : this.defaultParseScript(scriptContent);
  }

  defaultParseScript(scriptContent) {
    // Fallback parsing
    const paragraphs = scriptContent.split('\n\n').filter(p => p.trim());
    return paragraphs.map((text, index) => ({
      sceneNumber: index + 1,
      duration: 15,
      text,
      imagePrompt: text.substring(0, 100),
    }));
  }
}

export default ScriptGeneratorService;
