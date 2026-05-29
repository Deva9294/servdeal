import axios from 'axios';

// ElevenLabs Voice Generation Service
export class VoiceGeneratorService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.baseURL = 'https://api.elevenlabs.io';
  }

  // Get available voices
  async getAvailableVoices() {
    try {
      const response = await axios.get(`${this.baseURL}/v1/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return {
        success: true,
        voices: response.data.voices,
      };
    } catch (error) {
      console.error('Get voices error:', error.message);
      return {
        success: false,
        error: error.message,
        voices: this.getDefaultVoices(),
      };
    }
  }

  // Generate voiceover
  async generateVoiceover(text, voiceId = 'EXAVITQu4vr4xnSDxMaL', language = 'en') {
    try {
      const response = await axios.post(
        `${this.baseURL}/v1/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      // Convert to base64 or upload to storage
      const audioBase64 = Buffer.from(response.data).toString('base64');
      const duration = this.estimateDuration(text);

      return {
        success: true,
        audio: audioBase64,
        duration,
      };
    } catch (error) {
      console.error('Voice generation error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  estimateDuration(text) {
    // Rough estimation: ~150 words per minute
    const words = text.split(' ').length;
    return Math.ceil((words / 150) * 60); // in seconds
  }

  getDefaultVoices() {
    return [
      { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', accent: 'American' },
      { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', accent: 'American' },
      { voice_id: 'AZnzlk1XvdBFFXlQrKsT', name: 'Clyde', accent: 'American' },
    ];
  }
}

export default VoiceGeneratorService;
