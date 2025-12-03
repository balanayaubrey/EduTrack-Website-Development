import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, AlertTriangle, RefreshCw } from 'lucide-react';
import bg3 from 'figma:asset/090fb96927b99d476237fb3d190eb39f036500e1.png';
import logo from 'figma:asset/374a0e02cc44c0490007731c6b8a2ce74021479a.png';

export function AuthPage({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  // ✅ FIXED handleSubmit — COMPLETE + CLOSED PROPERLY
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowRecovery(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials or account not activated.");
        setShowRecovery(true);
        setIsLoading(false);
        return;
      }

      // Save token + user
      localStorage.setItem("edutrack_token", data.token);
      localStorage.setItem("edutrack_user", JSON.stringify(data.user));

      onLogin(data.user);
      setIsLoading(false);
      return;
    } catch (e) {
      setError("Server error.");
      setIsLoading(false);
      return;
    }
  }; // ← THIS WAS MISSING!

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        backgroundImage: `url(${bg3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">

        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 mb-4 relative">
            <img 
              src={logo} 
              alt="EduTrack Logo" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl -z-10"></div>
          </div>
          <h1 className="text-white text-4xl font-bold mb-2 drop-shadow-lg">
            EduTrack
          </h1>
          <p className="text-white/90 text-lg font-medium drop-shadow-md">
            Predict. Intervene. Succeed.
          </p>
        </div>

        <Card className="backdrop-blur-lg bg-white/95 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground">
              Sign in to your account
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {showRecovery && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 mt-2">Contact your administrator if you need access.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Access is by invitation only. Contact your administrator for an invitation link.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
