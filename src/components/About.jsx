import React from 'react';

function About() {
  return (
    <section id="about" className="max-w-3xl min-h-screen mx-auto mt-0 mb-8 p-6 bg-white rounded-sm shadow-md">
      <h1 className="text-3xl font-bold mb-4">About My Journal</h1>
      <p className="mb-4 text-gray-700">
        My Journal is a simple and intuitive journaling application designed to help you capture your thoughts, experiences, and reflections. Whether you're looking to document your daily life, track personal growth, or simply express yourself, My Journal provides a clean and user-friendly interface to do so.
      </p>
      <p className="mb-4 text-gray-700">
        With My Journal, you can easily create new entries, view your past entries, and keep your personal thoughts organized in one place. Your privacy is important to us, and all your journal entries are stored locally on your device.
      </p>
      <p className="mb-4 text-gray-700">
        We hope you enjoy using My Journal and find it to be a valuable tool for self-expression and reflection.
      </p>
    </section>
  );
}

export default About;