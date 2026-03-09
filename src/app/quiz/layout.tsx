import Nav from '@/components/Nav';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)',
        padding: '24px',
      }}>
        {children}
      </div>
    </>
  );
}
