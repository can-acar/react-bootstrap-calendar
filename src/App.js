import React from 'react';
import Calendar from './Calendar';
import './style.css';

export default function App() {
  return (
    <div>
      <h1 className="text-center mb-4">React Bootstrap Calendar</h1>
      <p></p>
      <p>
        <Calendar events={[]} />
      </p>
    </div>
  );
}
