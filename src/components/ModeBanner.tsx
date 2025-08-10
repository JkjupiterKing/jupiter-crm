'use client';

import { useEffect, useState } from 'react';
import { Database, TestTube } from 'lucide-react';

interface ModeBannerProps {
  className?: string;
}

export default function ModeBanner({ className = '' }: ModeBannerProps) {
  const [isMockMode, setIsMockMode] = useState<boolean | null>(null);

  useEffect(() => {
    // Check the current mode using the dedicated API endpoint
    const checkMode = async () => {
      try {
        const response = await fetch('/api/mode');
        if (response.ok) {
          const data = await response.json();
          setIsMockMode(data.isMockMode);
        } else {
          setIsMockMode(false); // Default to normal mode on error
        }
      } catch (error) {
        console.error('Error checking mode:', error);
        setIsMockMode(false);
      }
    };

    checkMode();
  }, []);

  // Don't show banner until we've determined the mode
  if (isMockMode === null) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      {isMockMode ? (
        <div className="bg-yellow-500 text-yellow-900 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <TestTube className="w-4 h-4" />
          Mock Mode
        </div>
      ) : (
        <div className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Database className="w-4 h-4" />
          Normal Mode
        </div>
      )}
    </div>
  );
}
