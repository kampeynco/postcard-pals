import MainLayout from "@/components/layout/MainLayout";
import { PostcardTracker } from "@/components/postcards/PostcardTracker";
import { AddressVerification } from "@/components/address/AddressVerification";

const PostcardsPage = () => {
  const handleVerifiedAddress = (verifiedAddress: any) => {
    // Handle the verified address
    console.log('Verified address:', verifiedAddress);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Postcard Management</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <AddressVerification onVerified={handleVerifiedAddress} />
          <PostcardTracker />
        </div>
      </div>
    </MainLayout>
  );
};

export default PostcardsPage;