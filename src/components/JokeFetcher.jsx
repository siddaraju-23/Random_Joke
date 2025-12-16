import React, { useState } from 'react';

// Required API Endpoint
const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke/';

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
        // REQUIRED: "Fetching..." with three animated dots
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

/**
 * The main component for fetching and displaying the joke.
 */
const JokeFetcher = () => {
  const [joke, setJoke] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    // Reset state
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
      // REQUIRED: Error message
      setError('Could not fetch a joke. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (joke) {
      return (
        <div className="text-left w-full space-y-2 p-4">
          <p className="font-semibold text-gray-700 text-lg">{joke.setup}</p>
          <p className="text-xl text-blue-600 font-medium italic">
            {joke.punchline}
          </p>
        </div>
      );
    }

    return <p className="font-emibold text-black-500 text-sm">No joke yet.</p>;
  };

  return (
    // Adjusted max-w to 'lg' for wider card and cleaner central layout
    <div className="max-w-lg w-full mx-auto p-8 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Random Joke
      </h2>
      <div>
        <p className="flex items-center justify-center p-4">
          Click the button to fetch fresh one.
        </p>
      </div>

      {!error && (
        <>
          <div className="flex justify-center w-full mt-4">
            <Button
              text="Fetch Joke"
              onClick={fetchJoke}
              isLoading={isLoading}
            />
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            {renderContent()}
          </div>
        </>
      )}

      {error && (
        <div className="flex flex-col items-center w-full">
          <p className="text-red-500 text-sm font-medium">
            Could not fetch a joke.
          </p>
          <p className="text-red-500 text-sm font-medium mb-4">Try again.</p>

          <div className="flex justify-center w-full">
            <Button
              text="Fetch Joke"
              onClick={fetchJoke}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JokeFetcher;
