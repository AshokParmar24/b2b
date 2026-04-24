import BusinessCardForm from "@/components/forms/BusinessCardForm";

export const metadata = {
  title: "Edit Business Listing",
};

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Simulate fetching business data by ID
  const mockInitialData = {
    name: "Stark Industries",
    ownerName: "Tony Stark",
    email: "tony@stark.com",
    mobiles: [{ value: "9876543210" }, { value: "1122334455" }],
    countryId: "in",
    stateId: "mh",
    cityId: "bom",
    pincodeId: "400001",
    address: "Stark Tower, Manhattan",
    gstNumber: "22AAAAA0000A1Z5",
    hsnCodes: [{ code: "8484", description: "Mechanical seals" }],
    cardImages: ["https://images.unsplash.com/photo-1560179707-f14e90ef3623"],
  };

  return (
    <div className="animate-fadeInUp mx-auto max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-white">Update Listing</h1>
        <p className="text-gray-400">Modify your business details for ID: {id}</p>
      </div>
      <BusinessCardForm initialData={mockInitialData} isEditing={true} />
    </div>
  );
}
