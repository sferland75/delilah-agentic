import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Assessment {
  id: string;
  clientId: string;
  status: string;
  createdAt: string;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Stats {
  totalClients: number;
  totalAssessments: number;
  inProgressAssessments: number;
}

// TODO: Replace with actual API client
const mockApiClient = {
  getAssessments: () => Promise.resolve([]),
  getClients: () => Promise.resolve([])
};

export function DashboardPage() {
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<Stats>({ totalClients: 0, totalAssessments: 0, inProgressAssessments: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentsData, clientsData] = await Promise.all([
          mockApiClient.getAssessments(),
          mockApiClient.getClients()
        ]);
        
        setRecentAssessments(assessmentsData.slice(0, 5));
        setClients(clientsData);
        
        setStats({
          totalClients: clientsData.length,
          totalAssessments: assessmentsData.length,
          inProgressAssessments: assessmentsData.filter(a => a.status === 'IN_PROGRESS').length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredClients = clients.filter(client => 
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg text-muted-foreground">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">{stats.totalClients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg text-muted-foreground">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">{stats.totalAssessments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">{stats.inProgressAssessments}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/assessment/new">New Assessment</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/clients/new">Add Client</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAssessments.length > 0 ? (
                recentAssessments.map((assessment) => (
                  <Link
                    key={assessment.id}
                    to={`/assessment/${assessment.id}`}
                    className="block p-3 bg-muted rounded hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span>Assessment #{assessment.id.slice(0, 8)}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(assessment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Status: {assessment.status.replace('_', ' ')}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground">No recent assessments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="space-y-2">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <Link
                    key={client.id}
                    to={`/clients/${client.id}`}
                    className="block p-3 bg-muted rounded hover:bg-muted/80 transition-colors"
                  >
                    <div className="font-medium">
                      {client.firstName} {client.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">{client.email}</div>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground">No clients found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}