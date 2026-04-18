import BusinessCardForm from "@/components/forms/BusinessCardForm";
export const metadata = {
  title: "Add Business Listing",
};

export default function AddBusinessPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <BusinessCardForm />
    </div>
  );
}
