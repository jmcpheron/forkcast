import eipsData from '../data/eips.json';
import { EIP } from '../types/eip';

interface ForkcastEIPData {
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
   * Get Forkcast data for a specific EIP
   */
  getForkcastData(eipId: number): ForkcastEIPData | null {
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
   * Get Forkcast data for multiple EIPs
   */
  getMultipleForkcastData(eipIds: number[]): Map<number, ForkcastEIPData> {
    const result = new Map<number, ForkcastEIPData>();
    
    eipIds.forEach(id => {
      const data = this.getForkcastData(id);
      if (data) {
        result.set(id, data);
      }
    });

    return result;
  }

  /**
   * Check if an EIP has Forkcast data
   */
  hasForkcastData(eipId: number): boolean {
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
   * Get all EIPs that have Forkcast data
   */
  getEIPsWithForkcastData(): number[] {
    return Array.from(this.eipMap.keys()).filter(id => this.hasForkcastData(id));
  }
}

// Export singleton instance
export const eipDataService = new EIPDataService();