export type ModalType = 'signing' | 'connecting' | 'error' | 'success' | 'info';
export type RequestType = 'transfer' | 'approve' | 'call' | 'read' | 'connect' | 'generic';

export interface WalletModalOptions {
  type?: ModalType;
  title?: string;
  subtitle?: string;
  message?: string;
  requestType?: RequestType;
  walletName?: string;
  icon?: string | HTMLElement;
  steps?: string[];
  showSpinner?: boolean;
  warning?: string;
  cancelable?: boolean;
  onCancel?: () => void;
}

export class WalletModal {
  private modal: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;
  private closeHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    this.injectStyles();
  }

  private injectStyles(): void {
    if (document.getElementById('pnp-wallet-modal-styles')) return;

    this.styleElement = document.createElement('style');
    this.styleElement.id = 'pnp-wallet-modal-styles';
    this.styleElement.textContent = `
      .pnp-wallet-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, sans-serif;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      .pnp-wallet-modal {
        background: #ffffff;
        border-radius: 12px;
        padding: 28px;
        width: 380px;
        max-width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        animation: pnp-modal-enter 0.2s ease-out;
        text-align: center;
        position: relative;
      }

      @keyframes pnp-modal-enter {
        from {
          transform: scale(0.98) translateY(10px);
          opacity: 0;
        }
        to {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
      }

      .pnp-modal-close {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 28px;
        height: 28px;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        color: #9ca3af;
      }

      .pnp-modal-close:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .pnp-modal-icon {
        width: 56px;
        height: 56px;
        margin: 0 auto 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .pnp-modal-icon.signing {
        background: #f3f4f6;
      }

      .pnp-modal-icon.connecting {
        background: #eff6ff;
      }

      .pnp-modal-icon.error {
        background: #fef2f2;
      }

      .pnp-modal-icon.success {
        background: #f0fdf4;
      }

      .pnp-modal-icon.info {
        background: #f5f3ff;
      }

      .pnp-modal-icon svg {
        width: 28px;
        height: 28px;
      }

      .pnp-modal-icon.signing svg {
        fill: #374151;
      }

      .pnp-modal-icon.connecting svg {
        fill: #2563eb;
      }

      .pnp-modal-icon.error svg {
        fill: #dc2626;
      }

      .pnp-modal-icon.success svg {
        fill: #16a34a;
      }

      .pnp-modal-icon.info svg {
        fill: #7c3aed;
      }

      .pnp-modal-icon img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }

      .pnp-modal-pulse {
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: 14px;
        animation: pnp-pulse 2s ease-out infinite;
      }

      .pnp-modal-pulse.signing {
        border: 2px solid #10b981;
      }

      .pnp-modal-pulse.connecting {
        border: 2px solid #3b82f6;
      }

      @keyframes pnp-pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(1.15);
          opacity: 0;
        }
      }

      .pnp-modal-title {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        line-height: 1.3;
        letter-spacing: -0.01em;
      }

      .pnp-modal-subtitle {
        margin: 0 0 20px;
        font-size: 14px;
        color: #6b7280;
        line-height: 1.5;
        font-weight: 400;
      }

      .pnp-modal-message {
        margin: 0 0 20px;
        padding: 12px;
        background: #f9fafb;
        border-radius: 8px;
        font-size: 13px;
        color: #4b5563;
        text-align: left;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
        word-break: break-all;
        max-height: 100px;
        overflow-y: auto;
        border: 1px solid #e5e7eb;
      }

      .pnp-modal-steps {
        margin: 0 0 20px;
        padding: 0;
        background: transparent;
        border-radius: 0;
        border: none;
        text-align: left;
      }

      .pnp-modal-step {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
        text-align: left;
        font-size: 14px;
        color: #374151;
        line-height: 1.5;
      }

      .pnp-modal-step:last-child {
        margin-bottom: 0;
      }

      .pnp-modal-step-number {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: transparent;
        color: #9ca3af;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        font-size: 12px;
        margin-right: 12px;
        flex-shrink: 0;
        border: 1.5px solid #e5e7eb;
        margin-top: 2px;
      }

      .pnp-modal-spinner {
        margin: 20px auto 0;
        width: 32px;
        height: 32px;
        border: 2px solid #f3f4f6;
        border-radius: 50%;
        animation: pnp-spin 0.8s linear infinite;
      }

      .pnp-modal-spinner.signing {
        border-top-color: #10b981;
      }

      .pnp-modal-spinner.connecting {
        border-top-color: #3b82f6;
      }

      .pnp-modal-spinner.error {
        border-top-color: #ef4444;
      }

      .pnp-modal-spinner.info {
        border-top-color: #8b5cf6;
      }

      @keyframes pnp-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .pnp-modal-warning {
        margin-top: 16px;
        padding: 10px 12px;
        background: #fef3c7;
        border: 1px solid #fcd34d;
        border-radius: 6px;
        font-size: 12px;
        color: #92400e;
        text-align: center;
        line-height: 1.5;
      }

      .pnp-modal-warning strong {
        font-weight: 600;
      }

      .pnp-modal-button {
        margin-top: 20px;
        padding: 10px 20px;
        background: #111827;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .pnp-modal-button:hover {
        background: #1f2937;
      }

      .pnp-modal-button.secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .pnp-modal-button.secondary:hover {
        background: #e5e7eb;
      }

      @media (prefers-color-scheme: dark) {
        .pnp-wallet-overlay {
          background: rgba(0, 0, 0, 0.6);
        }

        .pnp-wallet-modal {
          background: #18181b;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        .pnp-modal-close {
          color: #71717a;
        }

        .pnp-modal-close:hover {
          background: #27272a;
          color: #a1a1aa;
        }

        .pnp-modal-icon.signing {
          background: #27272a;
        }

        .pnp-modal-icon.connecting {
          background: #1e293b;
        }

        .pnp-modal-icon.error {
          background: #2a1a1a;
        }

        .pnp-modal-icon.success {
          background: #1a2a1a;
        }

        .pnp-modal-icon.info {
          background: #2a1a3a;
        }

        .pnp-modal-icon.signing svg {
          fill: #a1a1aa;
        }

        .pnp-modal-title {
          color: #fafafa;
        }

        .pnp-modal-subtitle {
          color: #a1a1aa;
        }

        .pnp-modal-message {
          background: #27272a;
          color: #d4d4d8;
          border-color: #3f3f46;
        }

        .pnp-modal-step {
          color: #e4e4e7;
        }

        .pnp-modal-step-number {
          color: #71717a;
          border-color: #3f3f46;
        }

        .pnp-modal-warning {
          background: #2a2717;
          border-color: #4a4a30;
          color: #fbbf24;
        }

        .pnp-modal-spinner {
          border-color: #27272a;
        }

        .pnp-modal-button {
          background: #fafafa;
          color: #18181b;
        }

        .pnp-modal-button:hover {
          background: #e4e4e7;
        }

        .pnp-modal-button.secondary {
          background: #27272a;
          color: #fafafa;
        }

        .pnp-modal-button.secondary:hover {
          background: #3f3f46;
        }
      }
    `;
    document.head.appendChild(this.styleElement);
  }

  public show(options: WalletModalOptions = {}): Promise<void> {
    return new Promise((resolve) => {
      // Remove any existing modal
      this.destroy();

      const type = options.type || 'info';
      const showSpinner = options.showSpinner !== false;

      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.className = 'pnp-wallet-overlay';

      // Create modal container
      const modal = document.createElement('div');
      modal.className = 'pnp-wallet-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');

      // Close button if cancelable
      if (options.cancelable) {
        const closeButton = document.createElement('button');
        closeButton.className = 'pnp-modal-close';
        closeButton.innerHTML = '✕';
        closeButton.onclick = () => {
          this.destroy();
          if (options.onCancel) options.onCancel();
          resolve();
        };
        modal.appendChild(closeButton);
      }

      // Icon
      const iconContainer = document.createElement('div');
      iconContainer.className = `pnp-modal-icon ${type}`;

      // Add pulse for signing/connecting
      if (type === 'signing' || type === 'connecting') {
        const pulse = document.createElement('div');
        pulse.className = `pnp-modal-pulse ${type}`;
        iconContainer.appendChild(pulse);
      }

      // Add icon content
      if (options.icon) {
        if (typeof options.icon === 'string') {
          if (options.icon.startsWith('<svg') || options.icon.startsWith('http')) {
            const img = document.createElement('img');
            img.src = options.icon;
            iconContainer.appendChild(img);
          } else {
            iconContainer.innerHTML = options.icon;
          }
        } else {
          iconContainer.appendChild(options.icon);
        }
      } else {
        // Default icons based on type
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');

        switch (type) {
          case 'signing':
            svg.innerHTML = '<path d="M20 7V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2h-1v2H5V5h14v2h1zm-9 5a1 1 0 0 0 0 2h11a1 1 0 0 0 0-2H11z"/>';
            break;
          case 'connecting':
            svg.innerHTML = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>';
            break;
          case 'error':
            svg.innerHTML = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>';
            break;
          case 'success':
            svg.innerHTML = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>';
            break;
          default:
            svg.innerHTML = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>';
        }
        iconContainer.appendChild(svg);
      }

      modal.appendChild(iconContainer);

      // Title
      const title = document.createElement('h2');
      title.className = 'pnp-modal-title';
      title.textContent = options.title || this.getDefaultTitle(type, options);
      modal.appendChild(title);

      // Subtitle
      if (options.subtitle || options.requestType) {
        const subtitle = document.createElement('p');
        subtitle.className = 'pnp-modal-subtitle';
        subtitle.textContent = options.subtitle || this.getDefaultSubtitle(options.requestType, options.walletName);
        modal.appendChild(subtitle);
      }

      // Message
      if (options.message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'pnp-modal-message';
        messageDiv.textContent = options.message;
        modal.appendChild(messageDiv);
      }

      // Steps
      if (options.steps && options.steps.length > 0) {
        const stepsContainer = document.createElement('div');
        stepsContainer.className = `pnp-modal-steps ${type}`;

        options.steps.forEach((step, index) => {
          const stepDiv = document.createElement('div');
          stepDiv.className = 'pnp-modal-step';

          const stepNumber = document.createElement('div');
          stepNumber.className = 'pnp-modal-step-number';
          stepNumber.textContent = `${index + 1}`;

          const stepText = document.createElement('div');
          stepText.textContent = step;

          stepDiv.appendChild(stepNumber);
          stepDiv.appendChild(stepText);
          stepsContainer.appendChild(stepDiv);
        });

        modal.appendChild(stepsContainer);
      }

      // Spinner
      if (showSpinner && (type === 'signing' || type === 'connecting')) {
        const spinner = document.createElement('div');
        spinner.className = `pnp-modal-spinner ${type}`;
        modal.appendChild(spinner);
      }

      // Warning
      if (options.warning) {
        const warning = document.createElement('div');
        warning.className = 'pnp-modal-warning';
        warning.innerHTML = options.warning;
        modal.appendChild(warning);
      }

      overlay.appendChild(modal);

      // Handle escape key if cancelable
      if (options.cancelable) {
        this.closeHandler = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            this.destroy();
            if (options.onCancel) options.onCancel();
            resolve();
          }
        };
        document.addEventListener('keydown', this.closeHandler as any);
      }

      // Store reference and add to DOM
      this.modal = overlay;
      document.body.appendChild(overlay);
    });
  }

  private getDefaultTitle(type: ModalType, options: WalletModalOptions): string {
    if (options.walletName) {
      switch (type) {
        case 'signing':
          return `Confirm on ${options.walletName}`;
        case 'connecting':
          return `Connecting to ${options.walletName}`;
        default:
          return options.walletName;
      }
    }

    switch (type) {
      case 'signing':
        return 'Confirm Transaction';
      case 'connecting':
        return 'Connecting Wallet';
      case 'error':
        return 'Error';
      case 'success':
        return 'Success';
      default:
        return 'Information';
    }
  }

  private getDefaultSubtitle(requestType?: RequestType, walletName?: string): string {
    switch (requestType) {
      case 'transfer':
        return 'Review and confirm the transaction details';
      case 'approve':
        return 'Review and approve the allowance';
      case 'call':
        return 'Confirm the smart contract interaction';
      case 'read':
        return 'Confirm the read operation';
      case 'connect':
        return `Connecting to ${walletName || 'wallet'}...`;
      default:
        return 'Please confirm the operation';
    }
  }

  public destroy(): void {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
    if (this.closeHandler) {
      document.removeEventListener('keydown', this.closeHandler as any);
      this.closeHandler = null;
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
let walletModalInstance: WalletModal | null = null;

export function getWalletModal(): WalletModal {
  if (!walletModalInstance) {
    walletModalInstance = new WalletModal();
  }
  return walletModalInstance;
}

export function cleanupWalletModal(): void {
  if (walletModalInstance) {
    walletModalInstance.cleanup();
    walletModalInstance = null;
  }
}

// Convenience functions for common use cases
export function showLedgerSigningModal(requestType?: RequestType): Promise<void> {
  return getWalletModal().show({
    type: 'signing',
    walletName: 'Ledger',
    requestType,
    steps: [
      'Check your Ledger device screen',
      'Review the transaction details',
      'Press both buttons to confirm'
    ],
    warning: '<strong>Do not close this window</strong> while confirming on your Ledger device.'
  });
}

export function showConnectingModal(walletName: string): Promise<void> {
  return getWalletModal().show({
    type: 'connecting',
    walletName,
    subtitle: 'Please wait while we establish connection...'
  });
}

export function showErrorModal(message: string, cancelable = true): Promise<void> {
  return getWalletModal().show({
    type: 'error',
    title: 'Error',
    message,
    cancelable
  });
}