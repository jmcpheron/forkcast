import eipsData from '../data/eips.json';
import { EIP } from '../types/eip';

interface NeutralEIPData {
  id: number;
  title: string;
  laymanDescription?: string;
  northStars?: string[];
  northStarAlignment?: {
    scaleL1?: { impact: string; description: string };
    scaleBlobs?: { impact: string; description: string };
    improveUX?: { impact: string; description: string };
  };
  stakeholderImpacts?: {
    endUsers: { impact: string; description: string };
    appDevs: { impact: string; description: string };
    walletDevs: { impact: string; description: string };
    toolingInfra: { impact: string; description: string };
    layer2s: { impact: string; description: string };
    stakersNodes: { impact: string; description: string };
    clClients: { impact: string; description: string };
    elClients: { impact: string; description: string };
  };
  benefits?: string[];
  tradeoffs?: string[];
}

class EIPDataService {
  private eipMap: Map<number, EIP>;

  constructor() {
    // Build a map for quick lookups
    this.eipMap = new Map();
    eipsData.forEach((eip: EIP) => {
      this.eipMap.set(eip.id, eip);
    });
  }

  /**
   * Get neutral data for a specific EIP
   */
  getNeutralData(eipId: number): NeutralEIPData | null {
    const eip = this.eipMap.get(eipId);
    if (!eip) return null;

    return {
      id: eip.id,
      title: eip.title,
      laymanDescription: eip.laymanDescription,
      northStars: eip.northStars,
      northStarAlignment: eip.northStarAlignment,
      stakeholderImpacts: eip.stakeholderImpacts,
      benefits: eip.benefits,
      tradeoffs: eip.tradeoffs
    };
  }

  /**
   * Get neutral data for multiple EIPs
   */
  getMultipleNeutralData(eipIds: number[]): Map<number, NeutralEIPData> {
    const result = new Map<number, NeutralEIPData>();
    
    eipIds.forEach(id => {
      const data = this.getNeutralData(id);
      if (data) {
        result.set(id, data);
      }
    });

    return result;
  }

  /**
   * Check if an EIP has Forkcast neutral data
   */
  hasNeutralData(eipId: number): boolean {
    const eip = this.eipMap.get(eipId);
    return !!(eip && (
      eip.laymanDescription ||
      eip.northStars ||
      eip.northStarAlignment ||
      eip.stakeholderImpacts ||
      eip.benefits ||
      eip.tradeoffs
    ));
  }

  /**
   * Get all EIPs that have neutral data
   */
  getEIPsWithNeutralData(): number[] {
    return Array.from(this.eipMap.keys()).filter(id => this.hasNeutralData(id));
  }
}

// Export singleton instance
export const eipDataService = new EIPDataService();