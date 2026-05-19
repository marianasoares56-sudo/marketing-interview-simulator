import { NextRequest } from 'next/server';
import { getAnthropicClient, MODEL } from '@/lib/anthropic';
import { buildAnalyzeAnswerPrompt } from '@/lib/prompts';
import type { Question } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, isMultipleChoice } = body as {
      question: Question;
      answer: string;
      isMultipleChoice: boolean;
    };

    if (!question || !answer) {
      return new Response(
        JSON.stringify({ error: 'question and answer are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { system, user } = buildAnalyzeAnswerPrompt(
      question,
      answer,
      isMultipleChoice ?? false
    );

    const client = getAnthropicClient();

    // Stream the response so the client can show progressive feedback
    const anthropicStream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: user }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of anthropicStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('analyze-answer error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze answer. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
