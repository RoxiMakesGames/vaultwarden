// ---------------------------------------------------------------------------
// Vaultwarden Plugin — Self-hosted password manager (Bitwarden-compatible).
// ---------------------------------------------------------------------------
import { definePlugin } from '../../cms/kernel/index.js';
import { Lock } from 'lucide-react';
import VaultwardenPage from './VaultwardenPage.jsx';
import { VaultwardenSettingsSection } from './VaultwardenSettingsSection.jsx';

export default definePlugin({
  id: 'vaultwarden_cplug',
  name: 'Vaultwarden',
  type: 'service',
  required: false,
  defaultEnabled: true,
  version: '0.1.0',
  description: 'Self-hosted password manager, Bitwarden-compatible.',
  icon: Lock,
  category: 'Services',
  tags: ['service', 'security', 'passwords'],
  requires: ['user_cplug', 'auth_cplug'],

  routes: [
    { path: '/services/vaultwarden', component: VaultwardenPage, label: 'Vaultwarden', permission: 'admin.config' },
  ],

  menuItems: [
    { id: 'vaultwarden', to: '/services/vaultwarden', icon: Lock, label: 'Vaultwarden', section: 'services', order: 45, permission: 'admin.config' },
  ],

  hooks: {
    hook_init({ registerService }) {
      registerService('vaultwarden', {
        _baseUrl: '',
        configure(url) { this._baseUrl = url; },
        getStatus() { return { configured: !!this._baseUrl, url: this._baseUrl }; },
      });
    },

    hook_permission() {
      return [
        { id: 'vaultwarden.admin',            label: 'Administer Vaultwarden',           module: 'vaultwarden' },
        { id: 'vaultwarden.settings.view',    label: 'View Vaultwarden settings',        module: 'vaultwarden' },
        { id: 'vaultwarden.settings.edit',    label: 'Edit Vaultwarden settings',        module: 'vaultwarden' },
        { id: 'vaultwarden.sync',             label: 'Sync users to Vaultwarden',        module: 'vaultwarden' },
        { id: 'vaultwarden.users.manage',     label: 'Manage Vaultwarden users',         module: 'vaultwarden' },
        { id: 'vaultwarden.users.invite',     label: 'Invite users to Vaultwarden',      module: 'vaultwarden' },
        { id: 'vaultwarden.orgs.manage',      label: 'Manage organizations',             module: 'vaultwarden' },
        { id: 'vaultwarden.emergency.access', label: 'Emergency access management',      module: 'vaultwarden' },
      ];
    },

    hook_settings() {
      return {
        id: 'vaultwarden',
        label: 'Vaultwarden',
        icon: Lock,
        weight: 63,
        category: 'Services',
        pluginId: 'vaultwarden_cplug',
        component: VaultwardenSettingsSection,
      };
    },

    hook_admin() {
      return {
        id: 'vaultwarden',
        label: 'Vaultwarden',
        icon: Lock,
        weight: 63,
        pluginId: 'vaultwarden_cplug',
        component: VaultwardenSettingsSection,
      };
    },

    hook_user_sync({ action, user }) {
      if (action === 'create' || action === 'login') {
        console.log(`[vaultwarden] Would provision/sync user ${user?.name || user?.uid} to Vaultwarden`);
      }
    },
  },
});
