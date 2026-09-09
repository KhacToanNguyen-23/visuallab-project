import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Chào mừng đến với VisualLab</h1>
      <Link to="/labs/1" className="text-primary hover:underline">
        Vào Thí nghiệm 1 (Con lắc lò xo)
      </Link>
    </div>
  );
}
