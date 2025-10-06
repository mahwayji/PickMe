import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif text-foreground">Dashboard</h1>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg text-foreground">Welcome back!</p>
            <p className="text-muted-foreground">Email: {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
