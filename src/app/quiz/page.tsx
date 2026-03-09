import Quiz from './Quiz';

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const params = await searchParams;
  return <Quiz autoStart={params.start === '1'} />;
}
