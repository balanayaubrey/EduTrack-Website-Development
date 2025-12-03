import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  UserPlus, Copy, Check, Mail, Clock, CheckCircle, 
  XCircle, Trash2, RefreshCw 
} from 'lucide-react';
import { Badge } from './ui/badge';

export function InvitationManagement({ user, targetRole }) {
  const [invitations, setInvitations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = () => {
    const allInvitations = JSON.parse(localStorage.getItem('edutrack_invitations') || '[]');
    const userInvitations = allInvitations.filter(
      inv => inv.invitedBy === user.id && inv.role === targetRole
    );
    setInvitations(userInvitations);
  };

  const generateToken = () => {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate email
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email is already invited or registered
    const allInvitations = JSON.parse(localStorage.getItem('edutrack_invitations') || '[]');
    const existingUsers = JSON.parse(localStorage.getItem('edutrack_users') || '[]');
    
    if (allInvitations.some(inv => inv.email === formData.email && inv.status === 'pending')) {
      setError('This email already has a pending invitation.');
      setIsLoading(false);
      return;
    }

    if (existingUsers.some(u => u.email === formData.email)) {
      setError('This email is already registered.');
      setIsLoading(false);
      return;
    }

    // Create invitation
    const newInvitation = {
      id: `inv-${Date.now()}`,
      token: generateToken(),
      name: formData.name,
      email: formData.email,
      department: targetRole === 'faculty' ? formData.department : user.department,
      role: targetRole,
      invitedBy: user.id,
      invitedByName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    // Save invitation
    allInvitations.push(newInvitation);
    localStorage.setItem('edutrack_invitations', JSON.stringify(allInvitations));

    setSuccess(`Invitation sent successfully to ${formData.email}!`);
    setFormData({ name: '', email: '', department: '' });
    setShowForm(false);
    loadInvitations();
    setIsLoading(false);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  const copyInvitationLink = (token) => {
    const invitationLink = `${window.location.origin}?invitation=${token}`;
    
    // Try modern clipboard API first, fallback to legacy method
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(invitationLink)
        .then(() => {
          setCopiedToken(token);
          setTimeout(() => setCopiedToken(null), 2000);
        })
        .catch(() => {
          // Fallback to legacy method
          fallbackCopyTextToClipboard(invitationLink, token);
        });
    } else {
      // Use fallback method
      fallbackCopyTextToClipboard(invitationLink, token);
    }
  };

  const fallbackCopyTextToClipboard = (text, token) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    
    document.body.removeChild(textArea);
  };

  const deleteInvitation = (invitationId) => {
    const allInvitations = JSON.parse(localStorage.getItem('edutrack_invitations') || '[]');
    const updatedInvitations = allInvitations.filter(inv => inv.id !== invitationId);
    localStorage.setItem('edutrack_invitations', JSON.stringify(updatedInvitations));
    loadInvitations();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Accepted</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">
            Invite {targetRole === 'faculty' ? 'Faculty' : 'Students'}
          </h2>
          <p className="text-gray-600">
            Send invitation links to {targetRole === 'faculty' ? 'faculty members' : 'students'}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          New Invitation
        </Button>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Invitation</CardTitle>
          </CardHeader>
          <CardContent>
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
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  An invitation link will be generated for this user
                </p>
              </div>

              {targetRole === 'faculty' && user.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <Input
                    type="text"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Invitation History</CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserPlus className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No invitations sent yet</p>
              <p className="text-sm">Click "New Invitation" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    {targetRole === 'faculty' && <TableHead>Department</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => {
                    const expired = isExpired(invitation.expiresAt);
                    const currentStatus = expired && invitation.status === 'pending' ? 'expired' : invitation.status;
                    
                    return (
                      <TableRow key={invitation.id}>
                        <TableCell>{invitation.name}</TableCell>
                        <TableCell>{invitation.email}</TableCell>
                        {targetRole === 'faculty' && <TableCell>{invitation.department}</TableCell>}
                        <TableCell>{getStatusBadge(currentStatus)}</TableCell>
                        <TableCell>
                          {new Date(invitation.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {currentStatus === 'pending' && !expired && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyInvitationLink(invitation.token)}
                              >
                                {copiedToken === invitation.token ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy Link
                                  </>
                                )}
                              </Button>
                            )}
                            {(currentStatus === 'pending' || currentStatus === 'expired') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteInvitation(invitation.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
