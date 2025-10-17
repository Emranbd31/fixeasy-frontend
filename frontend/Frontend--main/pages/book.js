import { useEffect, useState } from 'react';

export default function Book() {
  const [status, setStatus] = useState('Checking backend...');
  const [form, setForm] = useState({ name: '', service: '', date: '', note: '' });

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('https://api.fixeasy.irish/');
        if (res.ok) {
          const data = await res.json();
          setStatus(`✅ Backend Live: ${data.message}`);
        } else {
          setStatus('⚠️ Backend reachable but returned error');
        }
      } catch {
        setStatus('❌ Backend not reachable');
      }
    }
    checkBackend();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ name: '', service: '', date: '', note: '' });
  };

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(to bottom, #f9f9ff, #e8f0ff)',
      minHeight: '100vh',
      padding: '60px 20px'
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '10px' }}>
        Book a Service — FixEasy Ireland
      </h1>
      <p style={{ textAlign: 'center', color: '#555', marginBottom: '30px' }}>
        Real local pros. Choose your service and confirm your booking.
      </p>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type='text' required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle} placeholder='Enter your name' />

          <label style={{ marginTop: '20px' }}>Service</label>
          <select required value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            style={inputStyle}>
            <option value=''>Select service</option>
            <option>Plumbing</option>
            <option>Cleaning</option>
            <option>Electrical</option>
            <option>Painting</option>
            <option>Gardening</option>
            <option>Moving Help</option>
          </select>

          <label style={{ marginTop: '20px' }}>Preferred Date</label>
          <input type='date' required value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            style={inputStyle} />

          <label style={{ marginTop: '20px' }}>Note (optional)</label>
          <textarea value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            style={{ ...inputStyle, height: '80px' }}
            placeholder='Describe your request...' />

          <button type='submit'
            style={{
              width: '100%',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              marginTop: '25px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
            Confirm Booking
          </button>
        </form>
      </div>
      <p style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>{status}</p>
      <p style={{ textAlign: 'center', color: '#999', marginTop: '60px' }}>
        © {new Date().getFullYear()} FixEasy Ireland — All rights reserved
      </p>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  fontSize: '1rem',
  boxSizing: 'border-box'
};

