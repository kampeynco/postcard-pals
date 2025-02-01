import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface GroupCardProps {
  title: string;
  children: ReactNode;
  onSave: () => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export const GroupCard = ({ 
  title, 
  children, 
  onSave, 
  isLoading = false,
  disabled = false 
}: GroupCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button 
          onClick={onSave} 
          disabled={disabled || isLoading}
          size="sm"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};