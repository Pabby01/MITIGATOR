'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Calendar,
  Link as LinkIcon,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Award,
  ArrowLeft,
  Camera,
  Heart,
  Repeat,
  FileText,
  Activity,
  Sparkles,
} from 'lucide-react';
import { UserProfile, CommunityPost } from '@/lib/services/community-service';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { cn } from '@/lib/utils';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleOrAddress: string | null;
  currentUserAddress?: string | null;
  onPostClick?: (post: CommunityPost) => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  handleOrAddress,
  currentUserAddress,
  onPostClick,
}: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'trades' | 'replies' | 'likes'>('posts');
  const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  useEffect(() => {
    if (isOpen && handleOrAddress) {
      setLoading(true);
      fetch(`/api/community?action=get_profile&handle=${encodeURIComponent(handleOrAddress)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.profile) {
            setProfile(data.profile);
            setEditName(data.profile.name);
            setEditBio(data.profile.bio);
            setEditAvatar(data.profile.avatar || '');
            setIsFollowing(currentUserAddress ? data.profile.followedBy?.includes(currentUserAddress) : false);
          }
        })
        .catch((err) => console.warn('Failed to load profile:', err))
        .finally(() => setLoading(false));

      // Also load posts by this user
      fetch('/api/community?symbol=NVDAx')
        .then((res) => res.json())
        .then((data) => {
          if (data?.posts) {
            const clean = handleOrAddress.toLowerCase();
            const filtered = data.posts.filter(
              (p: CommunityPost) =>
                p.handle.toLowerCase().includes(clean) ||
                p.author.toLowerCase().includes(clean) ||
                (p.authorAddress && p.authorAddress.toLowerCase() === clean)
            );
            setUserPosts(filtered);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, handleOrAddress, currentUserAddress]);

  if (!isOpen || !handleOrAddress) return null;

  const isOwnProfile =
    currentUserAddress &&
    profile &&
    (profile.address === currentUserAddress ||
      profile.handle.toLowerCase().includes(currentUserAddress.toLowerCase()));

  const handleToggleFollow = async () => {
    if (!profile) return;
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            followersCount: newFollowingState
              ? prev.followersCount + 1
              : Math.max(0, prev.followersCount - 1),
          }
        : null
    );

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_follow',
          targetHandle: profile.handle,
          userAddress: currentUserAddress || 'guest',
        }),
      });
    } catch (e) {
      console.warn('Follow error:', e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !currentUserAddress) return;

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          userAddress: currentUserAddress,
          updates: {
            name: editName.trim(),
            bio: editBio.trim(),
            avatar: editAvatar.trim() || undefined,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.profile) {
          setProfile(data.profile);
          setIsEditing(false);
        }
      }
    } catch (e) {
      console.error('Save profile failed:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl hairline-card bg-card shadow-2xl border border-border overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card/70 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h3 className="text-sm font-bold text-foreground leading-tight flex items-center gap-1.5">
                {profile?.name || handleOrAddress}
                {profile?.verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                {userPosts.length} posts · {profile?.publicTradesCount || 0} public trades
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {loading && !profile ? (
            <div className="p-12 text-center text-xs text-muted-foreground font-mono animate-pulse">
              Loading verified trader profile...
            </div>
          ) : profile ? (
            <div>
              {/* Profile Banner */}
              <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-blue-900/60 via-purple-900/50 to-emerald-950/60 relative border-b border-border/50">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
              </div>

              {/* Avatar & Action Button Row */}
              <div className="px-5 relative flex items-end justify-between -mt-12 sm:-mt-14 mb-3">
                <div className="relative">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-card bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xl sm:text-2xl font-bold text-foreground shadow-lg overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                    ) : (
                      profile.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute bottom-1 right-1 p-1.5 rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all"
                      title="Edit Profile Picture"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  {isOwnProfile ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-1.5 rounded-full border border-border hover:border-primary/50 text-xs font-semibold hover:bg-muted/50 transition-all"
                    >
                      Edit profile
                    </button>
                  ) : (
                    <button
                      onClick={handleToggleFollow}
                      className={cn(
                        'px-5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs',
                        isFollowing
                          ? 'border border-border hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-foreground'
                          : 'bg-foreground text-background hover:bg-foreground/90'
                      )}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              </div>

              {/* User Bio & Meta details */}
              <div className="px-5 space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-1.5">
                    {profile.name}
                    {profile.verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">{profile.handle}</p>
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  {profile.bio}
                </p>

                {/* Metadata icons (Joined, Address, Web) */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Joined {profile.joinedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <LinkIcon className="h-3.5 w-3.5" /> {profile.address.slice(0, 8)}...
                  </span>
                </div>

                {/* Followers & Following row */}
                <div className="flex items-center gap-5 text-xs">
                  <span className="text-muted-foreground">
                    <strong className="text-foreground font-bold font-mono">{profile.followingCount}</strong> Following
                  </span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground font-bold font-mono">{profile.followersCount}</strong> Followers
                  </span>
                </div>

                {/* MITIGATOR On-Chain Quantitative Performance Stats */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-xl border border-primary/25 bg-primary/5 text-center">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">Trust Score</span>
                    <span className="text-sm font-bold text-primary font-mono">{profile.trustScore}/100</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-center">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">Win Rate</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{profile.winRate}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-border bg-card/40 text-center">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">Verified Trades</span>
                    <span className="text-sm font-bold text-foreground font-mono">{profile.publicTradesCount}</span>
                  </div>
                </div>
              </div>

              {/* Tabs like X */}
              <div className="flex items-center border-b border-border/80 mt-4 px-2">
                {[
                  { key: 'posts' as const, label: 'Posts' },
                  { key: 'trades' as const, label: 'Public Trades' },
                  { key: 'replies' as const, label: 'Replies' },
                  { key: 'likes' as const, label: 'Likes' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={cn(
                      'flex-1 py-3 text-xs font-semibold border-b-2 transition-colors text-center relative -mb-px',
                      activeTab === t.key
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4 space-y-3">
                {/* 1. Posts Tab */}
                {activeTab === 'posts' && (
                  userPosts.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground font-mono">
                      No posts published by {profile.name} yet.
                    </div>
                  ) : (
                    userPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => onPostClick?.(post)}
                        className="p-3.5 rounded-xl border border-border/70 bg-card/40 hover:bg-card/70 hover:border-primary/40 transition-colors cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-primary">{post.symbol}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {new Date(post.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.engagement.likes}</span>
                          <span className="flex items-center gap-1"><Repeat className="h-3 w-3" /> {post.engagement.reposts}</span>
                        </div>
                      </div>
                    ))
                  )
                )}

                {/* 2. Public Trades Tab */}
                {activeTab === 'trades' && (
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/70 text-[11px] text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>All public trades are verifiable on-chain or recorded in the MITIGATOR Paper Trading ledger.</span>
                    </div>

                    {profile.publicTrades.map((trade) => (
                      <div
                        key={trade.id}
                        className="p-3 rounded-xl border border-border/70 bg-card/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xs text-primary font-mono">
                            {trade.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">{trade.symbol}</span>
                              <span
                                className={cn(
                                  'text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded',
                                  trade.side === 'buy' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                                )}
                              >
                                {trade.side}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                              Entry: ${trade.entryPrice.toFixed(2)} · Current: ${trade.currentPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={cn(
                              'text-xs font-bold font-mono',
                              trade.pnlPct >= 0 ? 'text-emerald-400' : 'text-red-400'
                            )}
                          >
                            {trade.pnlPct >= 0 ? '+' : ''}{trade.pnlPct.toFixed(2)}%
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono block">
                            {trade.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Replies Tab */}
                {activeTab === 'replies' && (
                  <div className="p-8 text-center text-xs text-muted-foreground font-mono">
                    Showing community replies and debate contributions for {profile.handle}.
                  </div>
                )}

                {/* 4. Likes Tab */}
                {activeTab === 'likes' && (
                  <div className="p-8 text-center text-xs text-muted-foreground font-mono">
                    Posts and trade ideas endorsed by {profile.name}.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Edit Profile Sub-Modal */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 bg-card z-20 p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="text-sm font-bold">Edit Profile</h4>
                  <button onClick={() => setIsEditing(false)} className="p-1 text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form id="edit-profile-form" onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-muted-foreground block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1">Bio</label>
                    <textarea
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1">Avatar Image URL (Optional)</label>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.png"
                      className="w-full bg-background border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </form>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-profile-form"
                  className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
