import { useEffect, useState } from 'react'
import Calendar from './components/Calender'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // ✅ Ask user permission for notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('✅ Notification permission granted!');
        } else {
          console.warn('❌ Notification permission denied.');
        }
      });
    }
  }, []);

  // ✅ Register background sync
  const registerSync = async () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      try {
        await registration.sync.register('sync-my-data');
        console.log('✅ Background sync registered!');
      } catch (err) {
        console.error('❌ Background sync registration failed:', err);
      }
    } else {
      console.warn('❗ Background sync not supported');
    }
  };

  return (
    <>
      <div className="head">
        <h2>DynamicDateBook</h2>
      </div>

      <div>
        <Calendar />
      </div>

      {/* Optional: Button to manually trigger sync registration */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={registerSync}>Register Background Sync</button>
      </div>
    </>
  )
}

export default App
