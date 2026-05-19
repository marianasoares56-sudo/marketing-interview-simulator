import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, MODEL } from '@/lib/anthropic';
import { buildGenerateQuestionsPrompt } from '@/lib/prompts';
import type { QuestionCategory, Difficulty, Question } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, difficulty, jobDescription } = body as {
      category: QuestionCategory;
      difficulty: Difficulty;
      jobDescription: string;
    };

    if (!category || !difficulty) {
      return NextResponse.json(
        { error: 'category and difficulty are required' },
        { status: 400 }
      );
    }

    const { system, user } = buildGenerateQuestionsPrompt(
      category,
      difficulty,
      jobDescription ?? ''
    );

    const client = getAnthropicClient();

    // Collect full response (streaming not used here because we need complete
    // JSON before we can render the question list to the user)
    let rawText = '';
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      system,
      messages: [{ role: 'user', content: user }],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        rawText += event.delta.text;
      }
    }

    let questions: Question[];
    try {
      const parsed = JSON.parse(rawText);
      // Claude sometimes returns { questions: [...] } instead of [...]
      questions = Array.isArray(parsed) ? parsed : parsed.questions ?? parsed;
    } catch {
      const match = rawText.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('Could not parse questions from response');
      questions = JSON.parse(match[0]);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions returned');
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('generate-questions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions. Please try again.' },
      { status: 500 }
    );
  }
}
