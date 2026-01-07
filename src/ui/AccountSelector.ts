import { Principal } from "@icp-sdk/core/principal";

export interface Account {
  owner: Principal;
  subaccount?: ArrayBuffer | Uint8Array;
}

export interface AccountSelectorOptions {
  walletName: string;
  accounts: Account[];
  onSelect: (index: number) => void;
  onCancel: () => void;
}

export class AccountSelector {
  private modal: HTMLElement | null = null;
  private styleElement: HTMLElement | null = null;

  constructor() {
    this.injectStyles();
  }

  private injectStyles(): void {
    if (document.getElementById('pnp-account-selector-styles')) return;

    this.styleElement = document.createElement('style');
    this.styleElement.id = 'pnp-account-selector-styles';
    this.styleElement.textContent = `
      .pnp-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      }

      .pnp-modal {
        background: #fafafa;
        border-radius: 12px;
        padding: 0;
        width: 500px;
        max-width: 90%;
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        animation: pnp-modal-slide-up 0.3s ease-out;
      }

      @keyframes pnp-modal-slide-up {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .pnp-modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
      }

      .pnp-modal-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #000000;
      }

      .pnp-modal-subtitle {
        margin: 6px 0 0;
        font-size: 14px;
        color: #666666;
      }

      .pnp-modal-body {
        padding: 8px;
        overflow-y: auto;
        flex: 1;
      }

      .pnp-account-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .pnp-account-item {
        margin: 0;
        padding: 0;
      }

      .pnp-account-button {
        width: 100%;
        padding: 16px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        border-radius: 8px;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .pnp-account-button:hover {
        background: #f5f5f5;
      }

      .pnp-account-button:focus {
        outline: 2px solid #d0d0d0;
        outline-offset: -2px;
      }

      .pnp-account-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f5f5f5;
        font-weight: 600;
        font-size: 16px;
        flex-shrink: 0;
      }

      .pnp-account-info {
        flex: 1;
        min-width: 0;
      }

      .pnp-account-label {
        font-size: 14px;
        font-weight: 500;
        color: #000000;
        margin-bottom: 4px;
      }

      .pnp-account-principal {
        font-size: 12px;
        color: #666666;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        word-break: break-all;
        line-height: 1.4;
      }


      .pnp-modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
      }

      .pnp-cancel-button {
        width: 100%;
        padding: 10px 16px;
        border: 1px solid #d1d5db;
        background: #fafafa;
        color: #000000;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .pnp-cancel-button:hover {
        background: #f5f5f5;
      }

      @media (prefers-color-scheme: dark) {
        .pnp-modal {
          background: #1a1a1a;
          color: #ffffff;
        }

        .pnp-modal-title {
          color: #ffffff;
        }

        .pnp-modal-subtitle {
          color: #999999;
        }

        .pnp-modal-header,
        .pnp-modal-footer {
          border-color: #333333;
        }

        .pnp-account-button:hover {
          background: #2a2a2a;
        }

        .pnp-account-label {
          color: #ffffff;
        }

        .pnp-account-principal {
          color: #999999;
        }

        .pnp-cancel-button {
          background: #2a2a2a;
          color: #ffffff;
          border-color: #444444;
        }

        .pnp-cancel-button:hover {
          background: #333333;
        }

        .pnp-account-button:focus {
          outline-color: #555555;
        }

      }
    `;
    document.head.appendChild(this.styleElement);
  }

  public async show(options: AccountSelectorOptions): Promise<number | null> {
    return new Promise((resolve) => {
      this.createModal(options, resolve);
    });
  }

  private createModal(options: AccountSelectorOptions, resolve: (index: number | null) => void): void {
    // Remove any existing modal
    this.destroy();

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'pnp-modal-overlay';

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'pnp-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'pnp-modal-title');

    // Create header
    const header = document.createElement('div');
    header.className = 'pnp-modal-header';

    const title = document.createElement('h2');
    title.id = 'pnp-modal-title';
    title.className = 'pnp-modal-title';
    title.textContent = `Select ${options.walletName} Account`;

    const subtitle = document.createElement('p');
    subtitle.className = 'pnp-modal-subtitle';
    subtitle.textContent = `Choose which account to connect with`;

    header.appendChild(title);
    header.appendChild(subtitle);

    // Create body with account list
    const body = document.createElement('div');
    body.className = 'pnp-modal-body';

    const accountList = document.createElement('ul');
    accountList.className = 'pnp-account-list';

    options.accounts.forEach((account, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'pnp-account-item';

      const button = document.createElement('button');
      button.className = 'pnp-account-button';
      button.onclick = () => {
        this.destroy();
        options.onSelect(index);
        resolve(index);
      };

      // Account icon with index
      const icon = document.createElement('div');
      icon.className = 'pnp-account-icon';
      icon.textContent = `${index + 1}`;

      // Account info
      const info = document.createElement('div');
      info.className = 'pnp-account-info';

      const label = document.createElement('div');
      label.className = 'pnp-account-label';
      label.textContent = `Account ${index + 1}`;

      const principal = document.createElement('div');
      principal.className = 'pnp-account-principal';
      const principalText = account.owner.toText();
      // Show shortened principal: first 5 and last 3 characters
      principal.textContent = `${principalText.slice(0, 5)}...${principalText.slice(-3)}`;
      principal.title = principalText; // Show full principal on hover

      info.appendChild(label);
      info.appendChild(principal);

      button.appendChild(icon);
      button.appendChild(info);
      listItem.appendChild(button);
      accountList.appendChild(listItem);
    });

    body.appendChild(accountList);

    // Create footer
    const footer = document.createElement('div');
    footer.className = 'pnp-modal-footer';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'pnp-cancel-button';
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => {
      this.destroy();
      options.onCancel();
      resolve(null);
    };

    footer.appendChild(cancelButton);

    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.destroy();
        options.onCancel();
        resolve(null);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Handle click outside
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        this.destroy();
        options.onCancel();
        resolve(null);
      }
    };

    // Store reference and add to DOM
    this.modal = overlay;
    document.body.appendChild(overlay);

    // Focus first account button for accessibility
    const firstButton = accountList.querySelector('.pnp-account-button') as HTMLElement;
    if (firstButton) {
      firstButton.focus();
    }
  }

  public destroy(): void {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
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
let accountSelectorInstance: AccountSelector | null = null;

export function getAccountSelector(): AccountSelector {
  if (!accountSelectorInstance) {
    accountSelectorInstance = new AccountSelector();
  }
  return accountSelectorInstance;
}

export function cleanupAccountSelector(): void {
  if (accountSelectorInstance) {
    accountSelectorInstance.cleanup();
    accountSelectorInstance = null;
  }
}