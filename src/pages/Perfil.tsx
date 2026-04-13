import PlatformLayout from "@/components/PlatformLayout";
import VoiceSelector from "@/components/VoiceSelector";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Building, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, Avatar } from "@/components/ui/VoiceUI";
import { supabase } from "@/integrations/supabase/client";

const Perfil = () => {
  const { currentUser, updateProfile } = useAuth();
  const userId = currentUser?.id || "";

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [company, setCompany] = useState(currentUser?.company || "");
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateProfile({ name, company });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setPasswordSaving(true);
    try {
      await supabase.auth.updateUser({ password: newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Error changing password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your account settings and preferences.</p>

        {/* User Info Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="mb-6">
          <Card hover>
            <div className="flex items-start gap-6">
              <Avatar name={currentUser?.name || "U"} size={80} />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{currentUser?.name || "User"}</h2>
                <p className="text-muted-foreground text-sm mb-2">{currentUser?.email}</p>
                {currentUser?.company && (
                  <p className="text-xs" style={{ color: "var(--gold)" }}>
                    {currentUser.company}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Voice Settings Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
          <Card hover>
            <h3 className="font-semibold mb-4">Voice Settings</h3>
            <VoiceSelector compact={true} />
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card hover>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-4 w-4" style={{ color: "var(--gold)" }} />
                Personal Information
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={currentUser?.email || ""}
                    disabled
                    className="h-11 rounded-xl opacity-50"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Email cannot be changed.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name (optional)"
                    className="h-11 rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full h-11 rounded-xl font-medium"
                  style={{
                    backgroundColor: "var(--gold)",
                    color: "var(--text-primary)",
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Change Password */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card hover>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4" style={{ color: "var(--gold)" }} />
                Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={passwordSaving}
                  className="w-full h-11 rounded-xl font-medium"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                  variant="outline"
                >
                  {passwordSaving ? "Updating..." : "Change Password"}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PlatformLayout>
  );
};

export default Perfil;
