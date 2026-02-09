# AI Configuration Guide

## Overview
The AI features in Resume Builder allow you to automatically generate professional content for your resume sections using Google Gemini (or other AI providers).

## Features Enabled by AI
1. **Generate with AI** buttons in:
   - Experience descriptions
   - Project descriptions
   - Professional summary
   - Custom sections

2. **Resume Import** from:
   - PDF files
   - DOCX (Word) files

## Configuration Steps

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Configure Environment Variables

Open your `.env` file and add:

```bash
# AI Configuration
VITE_AI_PROVIDER="gemini"
VITE_AI_MODEL="gemini-1.5-flash"
VITE_AI_API_KEY="your-gemini-api-key-here"
VITE_AI_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
```

### 3. Restart Your Development Server

After updating the `.env` file, restart your development server:

```bash
pnpm dev
```

## Alternative AI Providers

### OpenAI (GPT)
```bash
VITE_AI_PROVIDER="openai"
VITE_AI_MODEL="gpt-4o"
VITE_AI_API_KEY="sk-..."
VITE_AI_BASE_URL="https://api.openai.com/v1"
```

### Anthropic (Claude)
```bash
VITE_AI_PROVIDER="anthropic"
VITE_AI_MODEL="claude-3-5-sonnet-20241022"
VITE_AI_API_KEY="sk-ant-..."
VITE_AI_BASE_URL="https://api.anthropic.com/v1"
```

### Ollama (Local)
```bash
VITE_AI_PROVIDER="ollama"
VITE_AI_MODEL="llama3"
VITE_AI_API_KEY=""
VITE_AI_BASE_URL="http://localhost:11434"
```

## Available Models

### Google Gemini
- `gemini-1.5-flash` (Fast, cost-effective)
- `gemini-1.5-pro` (More capable, slower)
- `gemini-2.0-flash-exp` (Experimental)

### OpenAI
- `gpt-4o` (Recommended)
- `gpt-4o-mini` (Faster, cheaper)
- `gpt-3.5-turbo` (Budget option)

### Anthropic
- `claude-3-5-sonnet-20241022` (Best quality)
- `claude-3-5-haiku-20241022` (Faster, cheaper)

## Testing

1. Open the resume builder
2. Add an experience or project section
3. Click the **"Generate with AI"** button
4. AI will generate professional content based on your input

## Troubleshooting

### Error: "AI is not configured"
- Make sure `VITE_AI_API_KEY` is set in your `.env` file
- Restart your dev server after changing `.env`

### Error: "Failed to generate content"
- Check if your API key is valid
- Verify you have credits/quota remaining
- Check the browser console for detailed error messages

### CORS Errors
- Some AI providers block browser requests due to CORS
- Consider using a CORS proxy or backend API route for production

## Cost Considerations

### Google Gemini (Free Tier)
- 1,500 requests per day (gemini-1.5-flash)
- 15 requests per minute
- Free for personal use

### OpenAI
- Pay-as-you-go pricing
- ~$0.01-0.03 per resume generation
- Requires payment method

### Anthropic
- Pay-as-you-go pricing
- Similar to OpenAI pricing
- Requires payment method

### Ollama
- **100% Free** (runs locally)
- No API key needed
- Requires local installation

## Privacy & Security

⚠️ **Important Notes:**
- AI credentials are stored in environment variables (client-side)
- API keys are sent directly from browser to AI provider
- No data is stored on Resume Builder servers
- Resume content is sent to the AI provider for generation
- Use `.env.local` (git-ignored) for production credentials

## Production Deployment

For production, use environment variables in your hosting platform:

**Vercel/Netlify:**
Add environment variables in your dashboard

**Docker:**
```bash
docker run -e VITE_AI_PROVIDER=gemini \
           -e VITE_AI_MODEL=gemini-1.5-flash \
           -e VITE_AI_API_KEY=your-key \
           -e VITE_AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta \
           your-app
```

## Disable AI Features

To disable AI features completely:
1. Remove or leave blank `VITE_AI_API_KEY` in `.env`
2. The "Generate with AI" buttons will be disabled
3. Resume import from PDF/DOCX will not work

## Support

For issues or questions:
- Check browser console for errors
- Verify API key is valid
- Ensure you have API quota/credits remaining
- Test connection directly with the AI provider's API
