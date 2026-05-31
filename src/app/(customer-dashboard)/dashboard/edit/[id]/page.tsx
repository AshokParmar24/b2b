import BusinessCardForm from "@/components/forms/BusinessCardForm";
import dbConnect from "@/lib/dbConnect";
import BusinessModel from "@/models/Business";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Business Listing",
};

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await dbConnect();
  
  // Fetch real database business listing by ID
  const business = await BusinessModel.findById(id).lean();
  
  if (!business) {
    notFound();
  }

  // Transform business model fields to fit BusinessCardForm properties
  const initialData = {
    name: business.businessName,
    ownerName: business.ownerName,
    email: business.email || "",
    mobiles: (business.mobiles || []).map((m: string) => ({ value: m })),
    countryId: business.countryId?.toString() || "",
    stateId: business.stateId?.toString() || "",
    cityId: business.cityId?.toString() || "",
    pincodeId: business.pincodeId?.toString() || "",
    address: business.address || "",
    gstNumber: business.gstNumber || "",
    hsnCodes: (business.hsnCodes || []).map((h: any) => ({ code: h.code, description: h.description })),
    cardImages: business.cardImages || [],
  };

  return (
    <div className="animate-fadeInUp mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-white">Update Listing</h1>
        <p className="text-gray-400">
          Modify your business details for: <span className="text-primary font-black">{initialData.name}</span>
        </p>
      </div>
      <BusinessCardForm initialData={initialData} isEditing={true} businessId={id} />
    </div>
  );
}
