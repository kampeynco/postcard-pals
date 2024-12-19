import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IntegrationStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function IntegrationStep({ onNext, onBack }: IntegrationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Integration Instructions</h2>
        <p className="text-sm text-gray-600">
          Follow these steps to complete your ActBlue integration
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>1. Set Up Webhook</CardTitle>
            <CardDescription>
              Configure your ActBlue webhook to send donation notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Log in to your ActBlue account</li>
              <li>Navigate to Account Settings > Webhooks</li>
              <li>Add a new webhook endpoint</li>
              <li>Copy and paste your unique webhook URL</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Test the Integration</CardTitle>
            <CardDescription>
              Ensure everything is working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Make a test donation through your ActBlue form</li>
              <li>Check your dashboard for the test donation</li>
              <li>Verify that a thank you postcard is generated</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Finish Setup</Button>
      </div>
    </div>
  );
}