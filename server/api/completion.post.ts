import { streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const google = createGoogleGenerativeAI({
    apiKey: config.googleGenerativeAiApiKey
  })
  const { prompt, mode, language } = await readBody(event)
  if (!prompt) {
    throw createError({ statusCode: 400, message: 'Prompt is required' })
  }

  let system: string

  const preserveMarkdown = 'IMPORTANT: Preserve all markdown formatting (bold, italic, links, etc.) exactly as in the original.'

  switch (mode) {
    case 'fix':
      system = `You are an expert editor. Your task is to correct all spelling, grammar, punctuation, and syntax errors in the provided text.
Instructions:
- Maintain the original voice and style.
- Do not add or remove content unless necessary for grammatical correctness.
- ${preserveMarkdown}
- Output ONLY the corrected text.`
  break
    case 'extend':
      system = `You are an expert writer. Your task is to expand upon the provided text, adding depth, detail, and clarity.
Instructions:
- elaborate on key points and provide examples where appropriate.
- Maintain the original tone and style.
- Ensure the expansion flows naturally from the original text.
- ${preserveMarkdown}
- Output ONLY the extended text.`
      break
    case 'reduce':
      system = `You are an expert editor. Your task is to rewrite the provided text to be more concise and direct.
Instructions:
- Remove unnecessary fluff and redundancy.
- Preserve the core meaning and all key information.
- ${preserveMarkdown}
- Output ONLY the shortened text.`
      break
    case 'simplify':
      system = `You are a clear writing specialist. Your task is to rewrite the provided text to be easily understood by a general audience.
Instructions:
- Use simple vocabulary and short sentences.
- Break down complex concepts into digestible parts.
- ${preserveMarkdown}
- Output ONLY the simplified text.`
      break
    case 'summarize':
      system = `You are an expert synthesizer. Your task is to provide a comprehensive summary of the text.
Instructions:
- Capture the main ideas and essential details.
- Use bullet points or a short paragraph as appropriate for the length.
- ${preserveMarkdown}
- Output ONLY the summary.`
      break
    case 'translate':
      system = `You are a professional translator. Your task is to translate the text into ${language || 'English'} with high accuracy and cultural nuance.
Instructions:
- Maintain the original tone, intent, and formatting.
- ${preserveMarkdown}
- Output ONLY the translated text.`
      break
    case 'continue':
    default:
      system = `You are an expert AI writing assistant embedded in a notion-like editor.
Your task is to provide high-quality, context-aware inline text completions.

CRITICAL INSTRUCTIONS:
1. **Context Awareness**: Analyze the user's input carefully. Understand the topic, tone, and sentence structure.
2. **Seamless Continuation**: Your output MUST be a natural continuation of the user's text. It should complete their thought or sentence logically.
3. **No Repetition**: NEVER repeat the last few words of the user's input. Start EXACTLY where they left off.
4. **Natural Length**: Provide a complete and satisfying continuation. Do not artificially cut off the text. If the context suggests a paragraph, write a paragraph.
5. **Formatting**: ${preserveMarkdown}
6. **No Chatty Conversationalism**: Do NOT output "Here is the completion" or any meta-text. JUST the completion text.
7. **Whitespace Handling**: If the prompt ends with a word and no space, start with a space if the next word requires it.

Example:
User: "The quick brown fox"
You: " jumps over the lazy dog." (Note the leading space if needed)`
      break
  }

  return streamText({
    model: google('models/gemini-3-flash-preview'),
    system,
    prompt
  }).toTextStreamResponse()
})
