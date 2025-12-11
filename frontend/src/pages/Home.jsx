import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Professional EA Licensing Platform
          </h1>
          <p className="text-xl mb-8">
            Manage and deploy Expert Advisors with confidence
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg">
              Get Started Free
            </Link>
            <Link to="/purchase" className="bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold text-lg">
              Browse EAs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;