export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>Page Not Found</p>
      <a href="/" style={{ marginTop: '1.5rem', padding: '0.5rem 1rem', background: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>
        Back to Documentation
      </a>
    </div>
  )
}
