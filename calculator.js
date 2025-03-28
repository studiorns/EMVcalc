/**
 * EMV Calculator Logic
 * Department of Culture and Tourism - Influencer Evaluation Tool
 */

class EMVCalculator {
  /**
   * Calculate the EMV based on input parameters
   * @param {Object} params - Calculation parameters
   * @param {number} params.impressions - Number of impressions
   * @param {number} params.engagements - Number of engagements
   * @param {number} params.marketMultiplier - Market multiplier value
   * @param {number} params.tierMultiplier - Tier multiplier value
   * @returns {Object} Calculation results
   */
  static calculate(params) {
    // Validate inputs
    if (!this.validateInputs(params)) {
      throw new Error('Invalid calculation parameters');
    }

    const { impressions, engagements, marketMultiplier, tierMultiplier } = params;

    // Calculate base EMV using the formula
    const baseEMV = (0.014 * impressions) + (0.14 * engagements) + 7000;
    
    // Calculate adjusted EMV
    const adjustedEMV = baseEMV * marketMultiplier * tierMultiplier;
    
    // Calculate additional metrics
    const emvPerThousandImpressions = (adjustedEMV / impressions) * 1000;
    const emvPerThousandEngagements = (adjustedEMV / engagements) * 1000;
    const emvEfficiency = adjustedEMV / (impressions + engagements);
    
    return {
      baseEMV,
      marketMultiplier,
      tierMultiplier,
      adjustedEMV,
      emvPerThousandImpressions,
      emvPerThousandEngagements,
      emvEfficiency
    };
  }

  /**
   * Validate calculation inputs
   * @param {Object} params - Calculation parameters
   * @returns {boolean} Whether inputs are valid
   */
  static validateInputs(params) {
    const { impressions, engagements, marketMultiplier, tierMultiplier } = params;
    
    // Check if all required parameters are present and valid
    if (
      typeof impressions !== 'number' || 
      typeof engagements !== 'number' || 
      typeof marketMultiplier !== 'number' || 
      typeof tierMultiplier !== 'number'
    ) {
      return false;
    }
    
    // Check if values are positive
    if (impressions <= 0 || engagements <= 0 || marketMultiplier <= 0 || tierMultiplier <= 0) {
      return false;
    }
    
    return true;
  }

  /**
   * Format a number as currency
   * @param {number} value - The value to format
   * @returns {string} Formatted currency string
   */
  static formatCurrency(value) {
    return '$' + value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  /**
   * Get market-specific tier multipliers data
   * @returns {Object} Object containing market-specific tier multipliers
   */
  static getMarketTierMultipliers() {
    return {
      Armenia: {
        marketMultiplier: 1.56,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 1.0,
          "Tier 3": 0.95,
          "Tier 4": 1.12
        }
      },
      Bahrain: {
        marketMultiplier: 0.83,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 0.92,
          "Tier 3": 0.81,
          "Tier 4": 1.05
        }
      },
      Belgium: {
        marketMultiplier: 1.02,
        tierMultipliers: {
          "Tier 1": 1.04,
          "Tier 2": 0.79,
          "Tier 3": 0.87,
          "Tier 4": 0.75
        }
      },
      Canada: {
        marketMultiplier: 1.29,
        tierMultipliers: {
          "Tier 1": 0.70,
          "Tier 2": 0.87,
          "Tier 3": 0.86,
          "Tier 4": 0.54
        }
      },
      Egypt: {
        marketMultiplier: 1.18,
        tierMultipliers: {
          "Tier 1": 0.54,
          "Tier 2": 0.83,
          "Tier 3": 0.88,
          "Tier 4": 0.58
        }
      },
      France: {
        marketMultiplier: 0.98,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 1.0,
          "Tier 3": 0.95,
          "Tier 4": 0.75
        }
      },
      Germany: {
        marketMultiplier: 1.31,
        tierMultipliers: {
          "Tier 1": 1.15,
          "Tier 2": 1.15,
          "Tier 3": 1.10,
          "Tier 4": 1.00
        }
      },
      India: {
        marketMultiplier: 1.33,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 1.00,
          "Tier 3": 0.95,
          "Tier 4": 0.75
        }
      },
      Italy: {
        marketMultiplier: 1.28,
        tierMultipliers: {
          "Tier 1": 1.10,
          "Tier 2": 1.05,
          "Tier 3": 1.00,
          "Tier 4": 0.80
        }
      },
      Kazakhstan: {
        marketMultiplier: 0.82,
        tierMultipliers: {
          "Tier 1": 0.95,
          "Tier 2": 0.95,
          "Tier 3": 0.90,
          "Tier 4": 0.75
        }
      },
      "Korea, Republic of": {
        marketMultiplier: 2.30,
        tierMultipliers: {
          "Tier 1": 1.00,
          "Tier 2": 0.95,
          "Tier 3": 0.90,
          "Tier 4": 0.75
        }
      },
      Kuwait: {
        marketMultiplier: 0.71,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 1.00,
          "Tier 3": 0.95,
          "Tier 4": 0.75
        }
      },
      Netherlands: {
        marketMultiplier: 1.04,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 1.00,
          "Tier 3": 0.95,
          "Tier 4": 0.80
        }
      },
      Oman: {
        marketMultiplier: 0.83,
        tierMultipliers: {
          "Tier 1": 1.00,
          "Tier 2": 0.95,
          "Tier 3": 0.90,
          "Tier 4": 0.75
        }
      },
      Pakistan: {
        marketMultiplier: 1.69,
        tierMultipliers: {
          "Tier 1": 1.00,
          "Tier 2": 0.95,
          "Tier 3": 0.90,
          "Tier 4": 0.75
        }
      },
      Poland: {
        marketMultiplier: 1.34,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 1.00,
          "Tier 3": 0.95,
          "Tier 4": 0.78
        }
      },
      Qatar: {
        marketMultiplier: 0.84,
        tierMultipliers: {
          "Tier 1": 1.00,
          "Tier 2": 0.95,
          "Tier 3": 0.90,
          "Tier 4": 0.75
        }
      },
      Romania: {
        marketMultiplier: 1.17,
        tierMultipliers: {
          "Tier 1": 1.25,
          "Tier 2": 1.20,
          "Tier 3": 1.15,
          "Tier 4": 1.00
        }
      },
      "Russian Federation": {
        marketMultiplier: 0.86,
        tierMultipliers: {
          "Tier 1": 1.00,
          "Tier 2": 0.95,
          "Tier 3": 0.90,
          "Tier 4": 0.75
        }
      },
      "Saudi Arabia": {
        marketMultiplier: 0.82,
        tierMultipliers: {
          "Tier 1": 1.00,
          "Tier 2": 0.95,
          "Tier 3": 0.90,
          "Tier 4": 0.75
        }
      },
      Spain: {
        marketMultiplier: 1.135,
        tierMultipliers: {
          "Tier 1": 1.10,
          "Tier 2": 1.05,
          "Tier 3": 1.00,
          "Tier 4": 0.80
        }
      },
      "United Arab Emirates": {
        marketMultiplier: 1.13,
        tierMultipliers: {
          "Tier 1": 1.10,
          "Tier 2": 1.05,
          "Tier 3": 1.00,
          "Tier 4": 0.80
        }
      },
      "United Kingdom": {
        marketMultiplier: 0.953,
        tierMultipliers: {
          "Tier 1": 1.00,
          "Tier 2": 0.95,
          "Tier 3": 0.90,
          "Tier 4": 0.70
        }
      },
      "United States": {
        marketMultiplier: 1.138,
        tierMultipliers: {
          "Tier 1": 0.95,
          "Tier 2": 0.90,
          "Tier 3": 0.85,
          "Tier 4": 0.65
        }
      },
      Uzbekistan: {
        marketMultiplier: 1.014,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 1.0,
          "Tier 3": 0.95,
          "Tier 4": 0.75
        }
      },
      Other: {
        marketMultiplier: 1.0,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 1.0,
          "Tier 3": 0.95,
          "Tier 4": 0.75
        }
      },
      Default: {
        marketMultiplier: 1.0,
        tierMultipliers: {
          "Tier 1": 1.05,
          "Tier 2": 1.0,
          "Tier 3": 0.95,
          "Tier 4": 0.75
        }
      }
    };
  }

  /**
   * Get market multipliers data
   * @returns {Array} Array of market multiplier objects
   */
  static getMarketMultipliers() {
    // Get all markets except 'Other'
    const markets = [
      { name: 'Armenia', value: 1.56 },
      { name: 'Bahrain', value: 0.83 },
      { name: 'Belgium', value: 1.02 },
      { name: 'Canada', value: 1.29 },
      { name: 'Egypt', value: 1.18 },
      { name: 'France', value: 0.98 },
      { name: 'Germany', value: 1.31 },
      { name: 'India', value: 1.33 },
      { name: 'Italy', value: 1.28 },
      { name: 'Kazakhstan', value: 0.82 },
      { name: 'Korea, Republic of', value: 2.30 },
      { name: 'Kuwait', value: 0.71 },
      { name: 'Netherlands', value: 1.04 },
      { name: 'Oman', value: 0.83 },
      { name: 'Pakistan', value: 1.69 },
      { name: 'Poland', value: 1.34 },
      { name: 'Qatar', value: 0.84 },
      { name: 'Romania', value: 1.17 },
      { name: 'Russian Federation', value: 0.86 },
      { name: 'Saudi Arabia', value: 0.82 },
      { name: 'Spain', value: 1.135 },
      { name: 'United Arab Emirates', value: 1.13 },
      { name: 'United Kingdom', value: 0.953 },
      { name: 'United States', value: 1.138 },
      { name: 'Uzbekistan', value: 1.014 }
    ].sort((a, b) => a.name.localeCompare(b.name));
    
    // Add 'Other' at the end
    markets.push({ name: 'Other', value: 1.00 });
    
    return markets;
  }
  
  /**
   * Get tier multipliers data
   * @returns {Array} Array of tier multiplier objects
   */
  static getTierMultipliers() {
    return [
      { name: 'Tier 1', value: 1.05 },
      { name: 'Tier 2', value: 1.0 },
      { name: 'Tier 3', value: 0.95 },
      { name: 'Tier 4', value: 0.75 }
    ];
  }
}

// Make the calculator available globally
window.EMVCalculator = EMVCalculator;
