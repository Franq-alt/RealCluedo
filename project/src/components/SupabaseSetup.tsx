import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AlertCircle, CheckCircle, ExternalLink, Copy, RefreshCw, Database } from 'lucide-react';

export const SupabaseSetup: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'not-configured'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [envVars, setEnvVars] = useState({
    url: import.meta.env.VITE_SUPABASE_URL || '',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  });

  const testConnection = async () => {
    setConnectionStatus('checking');
    setErrorMessage('');

    // First check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setConnectionStatus('not-configured');
      setErrorMessage('Supabase environment variables are not properly configured. Please update your .env file.');
      return;
    }

    try {
      // Test basic connection with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      );

      const connectionPromise = supabase
        .from('leaderboard')
        .select('count')
        .limit(1);

      const { data, error } = await Promise.race([connectionPromise, timeoutPromise]) as any;

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      setConnectionStatus('connected');
    } catch (error: any) {
      setConnectionStatus('error');
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Connection timeout')) {
        setErrorMessage('Cannot connect to Supabase. Please check your URL and ensure your Supabase project is running.');
      } else if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
        setErrorMessage('Invalid Supabase API key. Please check your anon key in the .env file.');
      } else if (error.message.includes('relation') || error.message.includes('does not exist')) {
        setErrorMessage('Database tables not found. Please run the migration SQL in your Supabase SQL Editor.');
      } else {
        setErrorMessage(`Connection failed: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    // Only test connection if we have both URL and key that aren't placeholders
    if (isSupabaseConfigured()) {
      testConnection();
    } else {
      setConnectionStatus('not-configured');
      setErrorMessage('Supabase environment variables contain placeholder values. Please update with your actual credentials.');
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isPlaceholderValue = (value: string, type: 'url' | 'key') => {
    if (type === 'url') {
      return !value || value.includes('your-project-ref') || value === 'https://your-project-ref.supabase.co';
    }
    return !value || value.includes('your-actual-anon-key-here') || value.length < 100;
  };

  if (connectionStatus === 'connected') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Supabase Connected Successfully</span>
          <Database className="w-4 h-4 ml-2" />
        </div>
        <p className="text-green-700 text-sm mt-1">
          Your database is ready and all tables are accessible.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Supabase Setup Required
          </h3>
          
          {connectionStatus === 'checking' ? (
            <div className="flex items-center gap-2 text-red-700">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Testing connection...</span>
            </div>
          ) : (
            <>
              <div className="bg-red-100 border border-red-300 rounded p-3 mb-4">
                <p className="text-red-800 font-medium mb-1">⚠️ Connection Status:</p>
                <p className="text-red-700 text-sm">
                  {errorMessage || 'Unable to connect to Supabase database.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Current Configuration:</h4>
                  <div className="bg-red-100 rounded p-3 font-mono text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600">VITE_SUPABASE_URL:</span>
                      <span className={isPlaceholderValue(envVars.url, 'url') ? 'text-red-700 font-bold' : 'text-green-700'}>
                        {envVars.url || '❌ Not set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600">VITE_SUPABASE_ANON_KEY:</span>
                      <span className={isPlaceholderValue(envVars.key, 'key') ? 'text-red-700 font-bold' : 'text-green-700'}>
                        {envVars.key ? 
                          (isPlaceholderValue(envVars.key, 'key') ? '❌ Placeholder value' : `✅ ${envVars.key.substring(0, 20)}...`) 
                          : '❌ Not set'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-red-800 mb-2">🚀 Quick Setup Guide:</h4>
                  <ol className="list-decimal list-inside space-y-3 text-red-700">
                    <li className="flex items-start gap-2">
                      <span className="min-w-0 flex-1">
                        <strong>Create Supabase Project:</strong> Go to{' '}
                        <a 
                          href="https://supabase.com/dashboard" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          supabase.com/dashboard <ExternalLink className="w-3 h-3" />
                        </a>
                        {' '}and create a new project
                      </span>
                    </li>
                    
                    <li>
                      <strong>Wait for setup:</strong> Project initialization takes 1-2 minutes
                    </li>
                    
                    <li className="flex items-start gap-2">
                      <span className="min-w-0 flex-1">
                        <strong>Get credentials:</strong> Go to Settings → API in your dashboard{' '}
                        <a 
                          href="https://supabase.com/dashboard/project/_/settings/api" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </span>
                    </li>
                    
                    <li>
                      <strong>Update .env file:</strong> Replace the placeholder values with your actual credentials:
                      <div className="bg-red-100 rounded p-3 mt-2 font-mono text-sm relative">
                        <button
                          onClick={() => copyToClipboard(`VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here`)}
                          className="absolute top-2 right-2 p-1 hover:bg-red-200 rounded"
                          title="Copy template to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <div className="text-gray-600"># Replace with your actual values:</div>
                        <div>VITE_SUPABASE_URL=https://your-project-ref.supabase.co</div>
                        <div>VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here</div>
                      </div>
                    </li>
                    
                    <li>
                      <strong>Run database migration:</strong> Copy and run the SQL from{' '}
                      <code className="bg-red-200 px-1 rounded">supabase/migrations/</code> in your Supabase SQL Editor
                    </li>
                    
                    <li>
                      <strong>Restart server:</strong> Run <code className="bg-red-200 px-1 rounded">npm run dev</code> to reload environment variables
                    </li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={testConnection}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Test Connection
                  </button>
                  
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Supabase
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};