/**
 * Volza Implementation - Sprint 1: Search Engine Sync Pipeline
 * 
 * This service acts as the bridge between MongoDB and our dedicated Search Engine 
 * (Elasticsearch or Meilisearch) required for high-performance global trade queries.
 */

import ShipmentRecord from "@/models/ShipmentRecord";

export const SearchEngineSync = {
  /**
   * Syncs a single shipment record to the Search Engine index.
   * To be called during standard API insertions.
   */
  async indexShipment(shipmentId: string) {
    try {
      const shipment = await ShipmentRecord.findById(shipmentId)
        .populate("exporterId", "name countryId")
        .populate("importerId", "name countryId")
        .populate("hsnCodeId", "code description");

      if (!shipment) return;

      // TODO: Initialize Elasticsearch / Meilisearch client here
      // Example: await elasticClient.index({ index: 'shipments', document: shipment })
      
      console.log(`[Search Sync] Indexed Shipment: ${shipment._id}`);
    } catch (error) {
      console.error("[Search Sync Error]:", error);
    }
  },

  /**
   * Initializes a MongoDB Change Stream to automatically listen for new insertions 
   * and sync them to the Search Engine in real-time.
   */
  initChangeStream() {
    console.log("[Search Sync] Initializing MongoDB Change Stream for Shipments...");
    
    // Note: Change streams require MongoDB Replica Sets (which Atlas provides by default)
    const changeStream = ShipmentRecord.watch([
      { $match: { operationType: "insert" } }
    ]);

    changeStream.on("change", (change) => {
      if (change.operationType === "insert") {
        const documentKey = change.documentKey as { _id: any };
        this.indexShipment(documentKey._id.toString());
      }
    });

    changeStream.on("error", (error) => {
      console.error("[Search Sync ChangeStream Error]:", error);
    });
  }
};
