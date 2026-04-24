import BusinessCardForm from "@/components/forms/BusinessCardForm";
export const metadata = {
  title: "Add Business Listing",
};

export default function AddBusinessPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <BusinessCardForm />
    </div>
  );
}
