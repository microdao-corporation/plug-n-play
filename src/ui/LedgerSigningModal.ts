export interface LedgerSigningModalOptions {
  message?: string;
  requestType?: 'transfer' | 'approve' | 'call' | 'read' | 'generic';
}

export class LedgerSigningModal {
  private modal: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;
  private animationFrame: number | null = null;

  constructor() {
    this.injectStyles();
  }

  private injectStyles(): void {
    if (document.getElementById('pnp-ledger-signing-styles')) return;

    this.styleElement = document.createElement('style');
    this.styleElement.id = 'pnp-ledger-signing-styles';
    this.styleElement.textContent = `
      .pnp-ledger-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      }

      .pnp-ledger-modal {
        background: #ffffff;
        border-radius: 16px;
        padding: 32px;
        width: 420px;
        max-width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        animation: pnp-ledger-slide-up 0.3s ease-out;
        text-align: center;
      }

      @keyframes pnp-ledger-slide-up {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .pnp-ledger-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        background: linear-gradient(135deg, #2c2c2c 0%, #000000 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .pnp-ledger-icon svg {
        width: 40px;
        height: 40px;
        fill: #ffffff;
      }

      .pnp-ledger-pulse {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        border: 2px solid #4CAF50;
        animation: pnp-ledger-pulse-animation 2s ease-out infinite;
      }

      @keyframes pnp-ledger-pulse-animation {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(1.3);
          opacity: 0;
        }
      }

      .pnp-ledger-title {
        margin: 0 0 12px;
        font-size: 24px;
        font-weight: 600;
        color: #000000;
      }

      .pnp-ledger-subtitle {
        margin: 0 0 24px;
        font-size: 16px;
        color: #666666;
        line-height: 1.5;
      }

      .pnp-ledger-message {
        margin: 0 0 24px;
        padding: 16px;
        background: #f5f5f5;
        border-radius: 8px;
        font-size: 14px;
        color: #333333;
        text-align: left;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }

      .pnp-ledger-instructions {
        margin: 0;
        padding: 20px;
        background: #e8f5e9;
        border-radius: 8px;
        border: 1px solid #4CAF50;
      }

      .pnp-ledger-step {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        text-align: left;
        font-size: 14px;
        color: #2e7d32;
      }

      .pnp-ledger-step:last-child {
        margin-bottom: 0;
      }

      .pnp-ledger-step-number {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #4CAF50;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 12px;
        margin-right: 12px;
        flex-shrink: 0;
      }

      .pnp-ledger-spinner {
        margin: 24px auto 0;
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #4CAF50;
        border-radius: 50%;
        animation: pnp-ledger-spin 1s linear infinite;
      }

      @keyframes pnp-ledger-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .pnp-ledger-warning {
        margin-top: 20px;
        padding: 12px;
        background: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 6px;
        font-size: 13px;
        color: #856404;
        text-align: left;
      }

      @media (prefers-color-scheme: dark) {
        .pnp-ledger-modal {
          background: #1a1a1a;
        }

        .pnp-ledger-title {
          color: #ffffff;
        }

        .pnp-ledger-subtitle {
          color: #999999;
        }

        .pnp-ledger-message {
          background: #2a2a2a;
          color: #cccccc;
        }

        .pnp-ledger-instructions {
          background: #1a3a1c;
          border-color: #2e7d32;
        }

        .pnp-ledger-warning {
          background: #332701;
          border-color: #664d03;
          color: #d3a630;
        }
      }
    `;
    document.head.appendChild(this.styleElement);
  }

  public show(options: LedgerSigningModalOptions = {}): void {
    // Remove any existing modal
    this.destroy();

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'pnp-ledger-overlay';

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'pnp-ledger-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'pnp-ledger-title');

    // Create Ledger icon with pulse
    const iconContainer = document.createElement('div');
    iconContainer.className = 'pnp-ledger-icon';

    const pulse = document.createElement('div');
    pulse.className = 'pnp-ledger-pulse';
    iconContainer.appendChild(pulse);

    // Ledger logo SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.innerHTML = `
      <path d="M20 7V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2h-1v2H5V5h14v2h1zm-9 5a1 1 0 0 0 0 2h11a1 1 0 0 0 0-2H11z"/>
    `;
    iconContainer.appendChild(svg);

    // Title
    const title = document.createElement('h2');
    title.id = 'pnp-ledger-title';
    title.className = 'pnp-ledger-title';
    title.textContent = 'Confirm on Ledger';

    // Subtitle based on request type
    const subtitle = document.createElement('p');
    subtitle.className = 'pnp-ledger-subtitle';

    switch (options.requestType) {
      case 'transfer':
        subtitle.textContent = 'Review and confirm the transaction details on your Ledger device';
        break;
      case 'approve':
        subtitle.textContent = 'Review and approve the allowance on your Ledger device';
        break;
      case 'call':
        subtitle.textContent = 'Confirm the smart contract interaction on your Ledger device';
        break;
      case 'read':
        subtitle.textContent = 'Confirm the read operation on your Ledger device';
        break;
      default:
        subtitle.textContent = 'Please check your Ledger device to confirm the operation';
    }

    // Custom message if provided
    let messageDiv: HTMLElement | null = null;
    if (options.message) {
      messageDiv = document.createElement('div');
      messageDiv.className = 'pnp-ledger-message';
      messageDiv.textContent = options.message;
    }

    // Instructions
    const instructions = document.createElement('div');
    instructions.className = 'pnp-ledger-instructions';

    const steps = [
      'Check your Ledger device screen',
      'Review the transaction details',
      'Press both buttons to confirm'
    ];

    steps.forEach((step, index) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'pnp-ledger-step';

      const stepNumber = document.createElement('div');
      stepNumber.className = 'pnp-ledger-step-number';
      stepNumber.textContent = `${index + 1}`;

      const stepText = document.createElement('div');
      stepText.textContent = step;

      stepDiv.appendChild(stepNumber);
      stepDiv.appendChild(stepText);
      instructions.appendChild(stepDiv);
    });

    // Spinner
    const spinner = document.createElement('div');
    spinner.className = 'pnp-ledger-spinner';

    // Warning
    const warning = document.createElement('div');
    warning.className = 'pnp-ledger-warning';
    warning.innerHTML = '⚠️ <strong>Do not close this window</strong> while confirming on your Ledger device.';

    // Assemble modal
    modal.appendChild(iconContainer);
    modal.appendChild(title);
    modal.appendChild(subtitle);
    if (messageDiv) {
      modal.appendChild(messageDiv);
    }
    modal.appendChild(instructions);
    modal.appendChild(spinner);
    modal.appendChild(warning);
    overlay.appendChild(modal);

    // Store reference and add to DOM
    this.modal = overlay;
    document.body.appendChild(overlay);
  }

  public destroy(): void {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  public cleanup(): void {
    this.destroy();
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
}

// Singleton instance
let ledgerSigningModalInstance: LedgerSigningModal | null = null;

export function getLedgerSigningModal(): LedgerSigningModal {
  if (!ledgerSigningModalInstance) {
    ledgerSigningModalInstance = new LedgerSigningModal();
  }
  return ledgerSigningModalInstance;
}

export function cleanupLedgerSigningModal(): void {
  if (ledgerSigningModalInstance) {
    ledgerSigningModalInstance.cleanup();
    ledgerSigningModalInstance = null;
  }
}