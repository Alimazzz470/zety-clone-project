import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription, coverLetterText } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Missing resume or job description' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `
            Compare this resume with this job description and provide detailed ATS analysis.
            
            RESUME:
            ${resumeText}

            JOB DESCRIPTION:
            ${jobDescription}
            ${coverLetterText ? `
            COVER LETTER:
            ${coverLetterText}` : ''}

            Please analyze and provide:
            1. ATS match score (0-100) based on keyword matching, skills alignment, and experience relevance
            2. Missing keywords from the job description that should be in the resume
            3. Specific, actionable improvement suggestions

            Return the response as a JSON object with the following structure:
            {
              "atsScore": <number>,
              "missingKeywords": ["keyword1", "keyword2"],
              "suggestions": ["suggestion1", "suggestion2"]
            }
            
            Focus on practical advice for improving ATS compatibility.
          `,
        },
      ],
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json(analysis);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
