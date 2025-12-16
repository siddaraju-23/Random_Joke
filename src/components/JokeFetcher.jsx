import React, { useState } from 'react';

// API Endpoint for fetching a random joke
const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke';

const JokeFetcher = () => {
  const [joke, setJoke] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    setJoke(null);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(JOKE_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setJoke({
        setup: data.setup,
        punchline: data.punchline,
      });
    } catch (err) {
      console.error('Failed to fetch joke:', err);

      setError('Could not fetch a joke. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-start w-full">
          <p className="text-red-500 text-sm font-medium">
            Could not fetch a joke.
          </p>
          <p className="text-red-500 text-sm font-medium">Try again.</p>
          <div className="mt-3">
            <Button
              text="Fetch Joke"
              onClick={fetchJoke}
              isLoading={isLoading}
            />
          </div>
        </div>
      );
    } else if (joke) {
      return (
        <div className="text-left w-full space-y-2  p-4">
          <p className="font-semibold text-gray-700">{joke.setup}</p>
          <p className="text-lg text-blue-600 font-medium">{joke.punchline}</p>
        </div>
      );
    } else {
      return <p className="text-gray-500 text-sm ">No Joke Yet.</p>;
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto p-8 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Random Joke
      </h2>
      <div>
        <p className="flex items-center justify-center p-4">
          Click the button to fetch fresh one.
        </p>
      </div>

      {!error && (
        <div className="flex justify-center w-full">
          <Button text="Fetch Joke" onClick={fetchJoke} isLoading={isLoading} />
        </div>
      )}
      <div className="min-h-17.5 flex  items-center justify-center px-10 mb-6">
        {renderContent()}
      </div>
    </div>
  );
};

// Reusable Button Component
const Button = ({ text, onClick, isLoading }) => {
  const buttonClasses = `
        py-2 px-6 rounded-md text-white font-medium transition duration-300 w-full max-w-[120px]
        flex items-center justify-center text-sm
        ${
          isLoading
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }
    `;

  return (
    <button onClick={onClick} disabled={isLoading} className={buttonClasses}>
      {isLoading ? (
        <>
          Fetching<span className="dot-1">.</span>
          <span className="dot-2">.</span>
          <span className="dot-3">.</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default JokeFetcher;
