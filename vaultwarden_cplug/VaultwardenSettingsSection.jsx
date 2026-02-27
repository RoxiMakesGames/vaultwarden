// ---------------------------------------------------------------------------
// Vaultwarden Settings Section — password vault configuration.
// ---------------------------------------------------------------------------

import React, { useState } from 'react';
import { useKernel } from '../../cms/kernel/providers.jsx';
import { Toggle, Field, Section, SettingsShell } from '../../cms/components/index.js';
import { Lock, Link, UserPlus, Shield } from 'lucide-react';

export function VaultwardenSettingsSection() {
  const { getService } = useKernel();
  const storage = getService('storage');
  const saved = storage?.get('svc:vaultwarden', {}) || {};

  const [enabled, setEnabled] = useState(saved.enabled ?? false);
  const [url, setUrl] = useState(saved.url || '');
  const [adminToken, setAdminToken] = useState(saved.adminToken || '');
  const [signupsEnabled, setSignupsEnabled] = useState(saved.signupsEnabled ?? false);
  const [invitationsEnabled, setInvitationsEnabled] = useState(saved.invitationsEnabled ?? true);
  const [showPasswordHints, setShowPasswordHints] = useState(saved.showPasswordHints ?? false);
  const [done, setDone] = useState(false);

  function save() {
    storage?.set('svc:vaultwarden', { enabled, url, adminToken, signupsEnabled, invitationsEnabled, showPasswordHints });
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <SettingsShell
      pluginId="vaultwarden"
      serviceId="vaultwarden"
      title="Vaultwarden"
      icon={Lock}
      iconColor="text-violet-400"
      badge={{ label: enabled ? 'Enabled' : 'Disabled', color: enabled ? 'emerald' : 'slate' }}
      onSave={save}
      saved={done}
      routingDefaults={{ defaultSubdomain: 'vault', defaultPort: 80 }}
    >
      <div className="space-y-5">
        <Toggle label="Enable Vaultwarden Integration" desc="Self-hosted Bitwarden-compatible password manager." value={enabled} onChange={setEnabled} card />

        {enabled && (
          <>
            <Section icon={Link} iconColor="text-blue-400" title="Connection">
              <div className="space-y-3">
                <Field label="Vaultwarden URL" value={url} onChange={setUrl} placeholder="https://vault.example.com" type="url" />
                <Field label="Admin Token" value={adminToken} onChange={setAdminToken} placeholder="••••••••" type="password" help="Used to access the Vaultwarden admin panel" />
              </div>
            </Section>

            <Section icon={UserPlus} iconColor="text-emerald-400" title="Registration">
              <div className="space-y-3">
                <Toggle label="Open Signups" desc="Allow anyone to create a new account." value={signupsEnabled} onChange={setSignupsEnabled} card />
                <Toggle label="Invitation System" desc="Allow users to invite others via email." value={invitationsEnabled} onChange={setInvitationsEnabled} card />
              </div>
            </Section>

            <Section icon={Shield} iconColor="text-amber-400" title="Security">
              <Toggle label="Show Password Hints" desc="Display password hints on the login page." value={showPasswordHints} onChange={setShowPasswordHints} card />
            </Section>
          </>
        )}
      </div>
    </SettingsShell>
  );
}
