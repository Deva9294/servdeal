import axios from 'axios';

// Stable Diffusion / Leonardo AI Image Generation Service
export class ImageGeneratorService {
  constructor() {
    this.apiKey = process.env.STABLE_DIFFUSION_API_KEY || process.env.LEONARDO_API_KEY;
    this.baseURL = 'https://api.leonardo.ai/v1';
  }

  async generateImage(prompt, style = 'cinematic', width = 1280, height = 720) {
    try {
      // Using Leonardo AI as example
      const response = await axios.post(
        `${this.baseURL}/generations`,
        {
          prompt: `${prompt} ${style} style, high quality, 8k`,
          width,
          height,
          num_images: 1,
          model: 'leonardo',
          negative_prompt: 'blurry, low quality, distorted',
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const imageUrl = response.data.generations?.[0]?.url || null;

      return {
        success: true,
        imageUrl,
        metadata: {
          prompt,
          style,
          dimensions: `${width}x${height}`,
        },
      };
    } catch (error) {
      console.error('Image generation error:', error.message);
      return {
        success: false,
        error: error.message,
        imageUrl: this.getPlaceholderImage(prompt),
      };
    }
  }

  // Generate multiple images for scenes
  async generateSceneImages(scenes, style = 'cinematic') {
    try {
      const images = [];

      for (const scene of scenes) {
        const result = await this.generateImage(scene.imagePrompt, style);
        images.push({
          sceneNumber: scene.sceneNumber,
          url: result.imageUrl,
          prompt: scene.imagePrompt,
        });

        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return {
        success: true,
        images,
      };
    } catch (error) {
      console.error('Scene images generation error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  getPlaceholderImage(prompt) {
    // Fallback placeholder
    const hash = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/1280/720?random=${hash}`;
  }
}

export default ImageGeneratorService;
