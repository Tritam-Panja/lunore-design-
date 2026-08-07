import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="px-6 pt-40 pb-32 text-center">
      <h1 className="text-6xl font-light text-[#c2a67e] mb-4">404</h1>
      <p className="text-lg text-[#a3a3a3] mb-8">This page could not be found.</p>
      <Link
        to="/"
        className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:underline"
      >
        Return Home
      </Link>
    </div>
  );
}
