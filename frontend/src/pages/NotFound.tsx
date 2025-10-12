import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <Home className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full"
            variant="default"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
