import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} EA License Manager. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
