/**
 * EMV Calculator UI Interactions
 * Department of Culture and Tourism - Influencer Evaluation Tool
 */

class EMVCalculatorUI {
  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.populateSelectOptions();
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    // Form elements
    this.impressionsInput = document.getElementById('impressions');
    this.engagementsInput = document.getElementById('engagements');
    this.marketSelect = document.getElementById('market');
    this.tierSelect = document.getElementById('tier');
    this.calculateBtn = document.getElementById('calculate-btn');
    this.formGroups = document.querySelectorAll('.form-group');
    
    // Results elements
    this.resultsContainer = document.getElementById('results');
    this.baseEmvElement = document.getElementById('base-emv');
    this.marketMultiplierElement = document.getElementById('market-multiplier');
    this.tierMultiplierElement = document.getElementById('tier-multiplier');
    this.adjustedEmvElement = document.getElementById('adjusted-emv');
    this.emvPerImpressionElement = document.getElementById('emv-per-impression');
    this.emvPerEngagementElement = document.getElementById('emv-per-engagement');
    this.emvEfficiencyElement = document.getElementById('emv-efficiency');
    
    // Flow visualization elements
    this.flowImpressionsElement = document.getElementById('flow-impressions');
    this.flowEngagementsElement = document.getElementById('flow-engagements');
    this.flowBaseEmvElement = document.getElementById('flow-base-emv');
    this.flowMarketMultiplierElement = document.getElementById('flow-market-multiplier');
    this.flowTierMultiplierElement = document.getElementById('flow-tier-multiplier');
    this.flowAdjustedEmvElement = document.getElementById('flow-adjusted-emv');
    
    // Tab elements
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.tabContents = document.querySelectorAll('.tab-content');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Calculate button click
    this.calculateBtn.addEventListener('click', this.handleCalculate.bind(this));
    
    // Tab switching
    this.tabButtons.forEach(button => {
      button.addEventListener('click', this.handleTabSwitch.bind(this));
    });
    
    // Form input validation
    this.impressionsInput.addEventListener('input', this.validateInput.bind(this));
    this.engagementsInput.addEventListener('input', this.validateInput.bind(this));
    
    // Market and tier selection changes
    this.marketSelect.addEventListener('change', (e) => {
      this.validateSelect(e);
      this.updateTierOptions();
      this.updateTierMultiplierDisplay();
    });
    
    this.tierSelect.addEventListener('change', (e) => {
      this.validateSelect(e);
      this.updateTierMultiplierDisplay();
    });
    
    // Form submission
    document.querySelector('form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCalculate();
    });
    
    // Auto-calculate on page load with default values
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.validateAllInputs();
        this.handleCalculate();
      }, 500);
    });
    
    // Add loading animation to calculate button
    this.calculateBtn.addEventListener('click', (e) => {
      const button = e.currentTarget;
      button.classList.add('btn-loading');
      button.innerHTML = '';
      
      setTimeout(() => {
        button.classList.remove('btn-loading');
        button.innerHTML = '<i aria-hidden="true" class="fas fa-calculator"></i> Calculate EMV';
      }, 800);
    });
  }

  /**
   * Populate select options from data
   */
  populateSelectOptions() {
    // Clear existing options
    this.marketSelect.innerHTML = '<option value="">Select a market</option>';
    this.tierSelect.innerHTML = '<option value="">Select a tier</option>';
    
    // Store market-tier multipliers for later use
    if (typeof EMVCalculator.getMarketTierMultipliers === 'function') {
      this.marketTierMultipliers = EMVCalculator.getMarketTierMultipliers();
      console.log("Loaded market-tier multipliers:", this.marketTierMultipliers);
    } else {
      this.marketTierMultipliers = null;
      console.log("No market-tier multipliers function available");
    }
    
    // Add market options
    EMVCalculator.getMarketMultipliers().forEach(market => {
      const option = document.createElement('option');
      
      // Get the market multiplier from the market-tier multipliers if available
      if (this.marketTierMultipliers && this.marketTierMultipliers[market.name]) {
        option.value = this.marketTierMultipliers[market.name].marketMultiplier;
      } else {
        option.value = market.value;
      }
      
      option.textContent = market.name;
      if (market.name === 'United Kingdom') {
        option.selected = true;
      }
      this.marketSelect.appendChild(option);
    });
    
    // Update tier options based on the selected market
    this.updateTierOptions();
    
    // Initialize the tier multiplier display
    this.updateTierMultiplierDisplay();
  }

  /**
   * Update tier multiplier display when market or tier changes
   */
  updateTierMultiplierDisplay() {
    const marketName = this.getSelectedText(this.marketSelect);
    const tierName = this.getSelectedText(this.tierSelect);
    
    if (!marketName || !tierName) return;
    
    console.log(`Updating tier multiplier display for ${marketName}, ${tierName}`);
    
    // Get the standard tier multiplier
    const standardTierMultiplier = parseFloat(this.tierSelect.value) || 0;
    const marketMultiplier = parseFloat(this.marketSelect.value) || 0;
    
    // Check if we have a market-specific tier multiplier
    let actualTierMultiplier = standardTierMultiplier;
    if (this.marketTierMultipliers && this.marketTierMultipliers[marketName] && 
        this.marketTierMultipliers[marketName].tierMultipliers && 
        this.marketTierMultipliers[marketName].tierMultipliers[tierName]) {
      actualTierMultiplier = this.marketTierMultipliers[marketName].tierMultipliers[tierName];
      console.log(`Found market-specific tier multiplier: ${actualTierMultiplier}`);
    }
    
    // Update the tier multiplier display
    if (this.tierMultiplierElement) {
      this.tierMultiplierElement.textContent = actualTierMultiplier.toFixed(2);
    }
    
    if (this.flowTierMultiplierElement) {
      this.flowTierMultiplierElement.textContent = actualTierMultiplier.toFixed(2);
    }
    
    // Update the market multiplier display
    if (this.marketMultiplierElement) {
      this.marketMultiplierElement.textContent = marketMultiplier.toFixed(2);
    }
    
    if (this.flowMarketMultiplierElement) {
      this.flowMarketMultiplierElement.textContent = marketMultiplier.toFixed(2);
    }
    
    // If both multipliers are set, we can calculate and show the adjusted EMV
    if (marketMultiplier > 0 && actualTierMultiplier > 0) {
      const impressions = parseFloat(this.impressionsInput.value) || 0;
      const engagements = parseFloat(this.engagementsInput.value) || 0;
      
      // Only proceed if we have valid impression and engagement values
      if (impressions > 0 && engagements > 0) {
        // Calculate EMV using the calculator class
        const results = EMVCalculator.calculate({
          impressions,
          engagements,
          marketMultiplier,
          tierMultiplier: actualTierMultiplier
        });
        
        // Update all results
        this.updateResults(results);
        this.updateFlowVisualization(impressions, engagements, results);
        
        // Show the results section if it's hidden
        if (this.resultsContainer.style.display === 'none') {
          this.resultsContainer.style.display = 'block';
          this.resultsContainer.style.opacity = '0';
          setTimeout(() => {
            this.resultsContainer.style.opacity = '1';
          }, 50);
        }
        
        // Log the updated values
        console.log(`Base EMV updated to: ${results.baseEMV}`);
        console.log(`Adjusted EMV updated to: ${results.adjustedEMV}`);
      }
    }
  }

  /**
   * Update tier options based on selected market
   */
  updateTierOptions() {
    const marketName = this.getSelectedText(this.marketSelect);
    if (!marketName) return;
    
    console.log(`Updating tier options for market: ${marketName}`);
    
    // Get the currently selected tier name (if any)
    const currentTierName = this.getSelectedText(this.tierSelect);
    
    // Clear existing options
    this.tierSelect.innerHTML = '<option value="">Select a tier</option>';
    
    // Get standard tier multipliers
    const standardTiers = EMVCalculator.getTierMultipliers();
    
    // Check if we have market-specific tier multipliers
    if (this.marketTierMultipliers && this.marketTierMultipliers[marketName] && 
        this.marketTierMultipliers[marketName].tierMultipliers) {
      
      const marketTiers = this.marketTierMultipliers[marketName].tierMultipliers;
      console.log(`Found market-specific tier multipliers for ${marketName}:`, marketTiers);
      
      // Add tier options with market-specific multipliers
      standardTiers.forEach(tier => {
        const option = document.createElement('option');
        
        // Use market-specific multiplier if available, otherwise use standard
        if (marketTiers[tier.name] !== undefined) {
          option.value = marketTiers[tier.name];
        } else {
          option.value = tier.value;
        }
        
        option.textContent = tier.name;
        
        // Select this option if it matches the previously selected tier
        if (tier.name === currentTierName) {
          option.selected = true;
        } else if (tier.name === 'Tier 2' && !currentTierName) {
          // Default to Tier 2 if no tier was previously selected
          option.selected = true;
        }
        
        this.tierSelect.appendChild(option);
      });
    } else {
      // If no market-specific multipliers, use standard ones
      console.log(`No market-specific tier multipliers found for ${marketName}, using standard values`);
      
      standardTiers.forEach(tier => {
        const option = document.createElement('option');
        option.value = tier.value;
        option.textContent = tier.name;
        
        if (tier.name === currentTierName) {
          option.selected = true;
        } else if (tier.name === 'Tier 2' && !currentTierName) {
          option.selected = true;
        }
        
        this.tierSelect.appendChild(option);
      });
    }
  }

  /**
   * Handle calculate button click
   */
  handleCalculate() {
    try {
      // Validate all inputs first
      if (!this.validateAllInputs()) {
        return;
      }
      
      // Get input values
      const impressions = parseFloat(this.impressionsInput.value) || 0;
      const engagements = parseFloat(this.engagementsInput.value) || 0;
      const marketMultiplier = parseFloat(this.marketSelect.value) || 0;
      
      // Get the tier multiplier directly from the dropdown
      // This will already be the market-specific value due to our updateTierOptions method
      const tierMultiplier = parseFloat(this.tierSelect.value) || 0;
      
      // Get selected market and tier names for logging
      const marketName = this.getSelectedText(this.marketSelect);
      const tierName = this.getSelectedText(this.tierSelect);
      
      console.log(`Selected market: ${marketName}, multiplier: ${marketMultiplier}`);
      console.log(`Selected tier: ${tierName}, multiplier: ${tierMultiplier}`);
      
      // Calculate EMV
      const results = EMVCalculator.calculate({
        impressions,
        engagements,
        marketMultiplier,
        tierMultiplier
      });
      
      // Update results display
      this.updateResults(results);
      
      // Update flow visualization
      this.updateFlowVisualization(impressions, engagements, results);
      
      // Show results with animation
      this.resultsContainer.style.display = 'block';
      this.resultsContainer.style.opacity = '0';
      setTimeout(() => {
        this.resultsContainer.style.opacity = '1';
      }, 50);
      
      // Scroll to results
      setTimeout(() => {
        this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      
      // Log for debugging
      console.log(`Market: ${marketName}, Multiplier: ${marketMultiplier}`);
      console.log(`Tier: ${tierName}, Multiplier: ${tierMultiplier}`);
      console.log(`Base EMV: ${results.baseEMV}, Adjusted EMV: ${results.adjustedEMV}`);
      
    } catch (error) {
      this.showError(error.message);
    }
  }

  /**
   * Update results display with calculation results
   * @param {Object} results - Calculation results
   */
  updateResults(results) {
    this.baseEmvElement.textContent = EMVCalculator.formatCurrency(results.baseEMV);
    this.marketMultiplierElement.textContent = results.marketMultiplier.toFixed(2);
    this.tierMultiplierElement.textContent = results.tierMultiplier.toFixed(2);
    this.adjustedEmvElement.textContent = EMVCalculator.formatCurrency(results.adjustedEMV);
    this.emvPerImpressionElement.textContent = EMVCalculator.formatCurrency(results.emvPerThousandImpressions);
    this.emvPerEngagementElement.textContent = EMVCalculator.formatCurrency(results.emvPerThousandEngagements);
    this.emvEfficiencyElement.textContent = results.emvEfficiency.toFixed(6);
  }
  
  /**
   * Update flow visualization with calculation values
   * @param {number} impressions - Number of impressions
   * @param {number} engagements - Number of engagements
   * @param {Object} results - Calculation results
   */
  updateFlowVisualization(impressions, engagements, results) {
    // Format numbers with commas
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Update flow visualization elements
    this.flowImpressionsElement.textContent = formatNumber(impressions);
    this.flowEngagementsElement.textContent = formatNumber(engagements);
    this.flowBaseEmvElement.textContent = EMVCalculator.formatCurrency(results.baseEMV);
    this.flowMarketMultiplierElement.textContent = results.marketMultiplier.toFixed(2);
    this.flowTierMultiplierElement.textContent = results.tierMultiplier.toFixed(2);
    this.flowAdjustedEmvElement.textContent = EMVCalculator.formatCurrency(results.adjustedEMV);
  }

  /**
   * Handle tab switching
   * @param {Event} event - Click event
   */
  handleTabSwitch(event) {
    const tabName = event.currentTarget.getAttribute('data-tab');
    
    // Deactivate all tabs
    this.tabButtons.forEach(btn => btn.classList.remove('active'));
    this.tabContents.forEach(content => content.classList.remove('active'));
    
    // Activate the selected tab
    event.currentTarget.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }

  /**
   * Validate number input
   * @param {Event} event - Input event
   */
  validateInput(event) {
    const input = event.target;
    const formGroup = input.closest('.form-group');
    const value = input.value.trim();
    
    // Remove any existing validation classes
    formGroup.classList.remove('error', 'success');
    
    // Allow empty input during typing
    if (value === '') return;
    
    // Check if input is a valid number
    if (isNaN(value) || parseFloat(value) <= 0) {
      formGroup.classList.add('error');
      return false;
    } else {
      formGroup.classList.add('success');
      return true;
    }
  }
  
  /**
   * Validate select input
   * @param {Event} event - Change event
   */
  validateSelect(event) {
    const select = event.target;
    const formGroup = select.closest('.form-group');
    const value = select.value;
    
    // Remove any existing validation classes
    formGroup.classList.remove('error', 'success');
    
    // Check if a value is selected
    if (!value) {
      formGroup.classList.add('error');
      return false;
    } else {
      formGroup.classList.add('success');
      return true;
    }
  }
  
  /**
   * Validate all inputs
   * @returns {boolean} Whether all inputs are valid
   */
  validateAllInputs() {
    let isValid = true;
    
    // Validate impressions
    if (!this.impressionsInput.value || isNaN(this.impressionsInput.value) || parseFloat(this.impressionsInput.value) <= 0) {
      this.impressionsInput.closest('.form-group').classList.add('error');
      isValid = false;
    } else {
      this.impressionsInput.closest('.form-group').classList.add('success');
    }
    
    // Validate engagements
    if (!this.engagementsInput.value || isNaN(this.engagementsInput.value) || parseFloat(this.engagementsInput.value) <= 0) {
      this.engagementsInput.closest('.form-group').classList.add('error');
      isValid = false;
    } else {
      this.engagementsInput.closest('.form-group').classList.add('success');
    }
    
    // Validate market
    if (!this.marketSelect.value) {
      this.marketSelect.closest('.form-group').classList.add('error');
      isValid = false;
    } else {
      this.marketSelect.closest('.form-group').classList.add('success');
    }
    
    // Validate tier
    if (!this.tierSelect.value) {
      this.tierSelect.closest('.form-group').classList.add('error');
      isValid = false;
    } else {
      this.tierSelect.closest('.form-group').classList.add('success');
    }
    
    return isValid;
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    // Create a custom error toast instead of using alert
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
      <div class="error-toast-icon"><i class="fas fa-exclamation-circle"></i></div>
      <div class="error-toast-message">${message}</div>
      <button class="error-toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'var(--danger-bg)';
    toast.style.color = 'var(--danger-light)';
    toast.style.padding = '12px 16px';
    toast.style.borderRadius = 'var(--radius)';
    toast.style.borderLeft = '4px solid var(--danger)';
    toast.style.boxShadow = 'var(--shadow-md)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.zIndex = 'var(--z-toast)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease';
    
    // Add to document
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 10);
    
    // Add close button functionality
    const closeBtn = toast.querySelector('.error-toast-close');
    closeBtn.addEventListener('click', () => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, 5000);
  }
  
  /**
   * Get selected option text
   * @param {HTMLSelectElement} selectElement - Select element
   * @returns {string} Selected option text
   */
  getSelectedText(selectElement) {
    return selectElement.options[selectElement.selectedIndex]?.text || '';
  }
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.emvCalculatorUI = new EMVCalculatorUI();
});
