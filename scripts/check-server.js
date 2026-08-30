async function check() {
  try {
    const res = await fetch('http://localhost:3000/api/supabase/status');
    console.log('API Status:', res.status);
    const json = await res.json();
    console.log('Response:', json);
  } catch (e) {
    console.log('Server not reachable:', e.message);
  }
}
check();
