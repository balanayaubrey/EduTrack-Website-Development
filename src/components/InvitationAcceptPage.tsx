import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import bg3 from 'figma:asset/090fb96927b99d476237fb3d190eb39f036500e1.png';
import logo from 'figma:asset/374a0e02cc44c0490007731c6b8a2ce74021479a.png';

export function InvitationAcceptPage({ invitationToken, onComplete }) {
  const [invitation, setInvitation] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load invitation from localStorage
    const invitations = JSON.parse(localStorage.getItem('edutrack_invitations') || '[]');
    const foundInvitation = invitations.find(inv => inv.token === invitationToken && inv.status === 'pending');
    
    if (foundInvitation) {
      setInvitation(foundInvitation);
    } else {
      setError('This invitation is invalid or has already been used.');
    }
  }, [invitationToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if username is already taken
    const existingUsers = JSON.parse(localStorage.getItem('edutrack_users') || '[]');
    if (existingUsers.some(user => user.username === formData.username)) {
      setError('Username is already taken. Please choose another one.');
      setIsLoading(false);
      return;
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username: formData.username,
      password: formData.password,
      name: invitation.name,
      email: invitation.email,
      role: invitation.role,
      department: invitation.department,
      invitedBy: invitation.invitedBy,
      createdAt: new Date().toISOString()
    };

    // Save user
    existingUsers.push(newUser);
    localStorage.setItem('edutrack_users', JSON.stringify(existingUsers));

    // Update invitation status
    const invitations = JSON.parse(localStorage.getItem('edutrack_invitations') || '[]');
    const updatedInvitations = invitations.map(inv => 
      inv.token === invitationToken 
        ? { ...inv, status: 'accepted', acceptedAt: new Date().toISOString(), userId: newUser.id }
        : inv
    );
    localStorage.setItem('edutrack_invitations', JSON.stringify(updatedInvitations));

    setSuccess(true);
    setIsLoading(false);

    // Redirect to login after 2 seconds
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (!invitation) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundImage: `url(${bg3})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80" />
        
        <Card className="relative z-10 backdrop-blur-lg bg-white/95 border-white/20 shadow-2xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={onComplete}>Return to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundImage: `url(${bg3})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80" />
        
        <Card className="relative z-10 backdrop-blur-lg bg-white/95 border-white/20 shadow-2xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-4">
              Your account has been successfully created. Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        backgroundImage: `url(${bg3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Branding */}
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

        {/* Invitation Accept Card */}
        <Card className="backdrop-blur-lg bg-white/95 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">
              Complete Your Account Setup
            </CardTitle>
            <p className="text-muted-foreground">
              You've been invited as {invitation.role}
            </p>
          </CardHeader>

          <CardContent>
            {/* Invitation Details */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">Invitation Details:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <div><strong>Name:</strong> {invitation.name}</div>
                <div><strong>Email:</strong> {invitation.email}</div>
                <div><strong>Role:</strong> {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}</div>
                {invitation.department && <div><strong>Department:</strong> {invitation.department}</div>}
              </div>
            </div>

            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Choose Username</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                  minLength={3}
                />
                <p className="text-xs text-gray-500 mt-1">At least 3 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Create Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
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
                <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    Creating Account...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onComplete}
                className="text-sm"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
