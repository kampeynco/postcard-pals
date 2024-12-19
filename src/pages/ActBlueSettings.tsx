import ActBlueAccountForm from "@/components/actblue/ActBlueAccountForm";

export default function ActBlueSettings() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ActBlue Account Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <ActBlueAccountForm />
      </div>
    </div>
  );
}