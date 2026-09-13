'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Repeat,
  Bookmark,
  Share2,
  MessageSquare,
  CheckCircle2,
  Send,
  Sparkles,
  Wallet,
  CornerDownRight,
} from 'lucide-react';
import { CommunityPost, CommunityComment } from '@/lib/services/community-service';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { cn } from '@/lib/utils';

interface PostThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPost | null;
  onLikePost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
  onOpenProfile: (handle: string) => void;
  currentUserAddress?: string | null;
  isWalletConnected: boolean;
  onOpenWalletModal: () => void;
}

export function PostThreadModal({
  isOpen,
  onClose,
  post,
  onLikePost,
  onRepostPost,
  onOpenProfile,
  currentUserAddress,
  isWalletConnected,
  onOpenWalletModal,
}: PostThreadModalProps) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load comments whenever modal opens for a post
  useEffect(() => {
    if (isOpen && post?.id) {
      setLoading(true);
      fetch(`/api/community?action=get_comments&postId=${post.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.comments) {
            setComments(data.comments);
          }
        })
        .catch((err) => console.warn('Failed to load comments:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, post?.id]);

  if (!isOpen || !post) return null;

  const isLiked = currentUserAddress ? post.likedBy?.includes(currentUserAddress) : false;
  const isReposted = currentUserAddress ? post.repostedBy?.includes(currentUserAddress) : false;

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !isWalletConnected) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_comment',
          postId: post.id,
          symbol: post.symbol,
          comment: {
            author: currentUserAddress ? `Trader ${currentUserAddress.slice(0, 4)}...${currentUserAddress.slice(-4)}` : 'Solana Trader',
            authorAddress: currentUserAddress || 'guest',
            handle: currentUserAddress ? `@${currentUserAddress.slice(0, 6)}` : '@trader',
            verified: true,
            content: replyText.trim(),
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.comment) {
          setComments((prev) => [...prev, data.comment]);
          setReplyText('');
        }
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const userLiked = currentUserAddress ? c.likedBy.includes(currentUserAddress) : false;
          return {
            ...c,
            likes: userLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
            likedBy: userLiked
              ? c.likedBy.filter((a) => a !== currentUserAddress)
              : [...c.likedBy, currentUserAddress || 'guest'],
          };
        }
        return c;
      })
    );

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like_comment',
          postId: post.id,
          commentId,
          userAddress: currentUserAddress || 'guest',
        }),
      });
    } catch (e) {
      console.warn('Like comment failed:', e);
    }
  };

  const handleReplyToUser = (handle: string) => {
    setReplyText((prev) => (prev.includes(handle) ? prev : `${handle} ${prev}`));
  };

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/community?post=${post.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl hairline-card bg-card shadow-2xl border border-border overflow-hidden"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 bg-card/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight">Thread</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-mono font-semibold text-primary">{post.symbol}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable conversation body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          {/* Main Original Post */}
          <div className="space-y-3.5 pb-4 border-b border-border/60">
            {/* Author details */}
            <div className="flex items-start justify-between">
              <button
                type="button"
                onClick={() => onOpenProfile(post.handle)}
                className="flex items-center gap-3 text-left group"
              >
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold text-sm text-foreground group-hover:ring-2 group-hover:ring-primary transition-all">
                  {post.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {post.author}
                    </p>
                    {post.verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{post.handle}</p>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded',
                    post.sentiment === 'bullish'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : post.sentiment === 'bearish'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30'
                  )}
                >
                  {post.sentiment}
                </span>
                <SourceBadge tier={post.sourceTier} />
              </div>
            </div>

            {/* Post Content */}
            <p className="text-base sm:text-lg leading-relaxed text-foreground font-normal whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Timestamp & Meta */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono pt-1">
              <span>{new Date(post.postedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              <span>·</span>
              <span>{new Date(post.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              {post.evidenceAttached && (
                <>
                  <span>·</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Empirical Evidence Linked
                  </span>
                </>
              )}
            </div>

            {/* Metrics stats row (like X) */}
            <div className="flex items-center gap-5 py-2.5 border-y border-border/50 text-xs text-muted-foreground">
              <span>
                <strong className="text-foreground font-bold">{post.engagement.likes}</strong> Likes
              </span>
              <span>
                <strong className="text-foreground font-bold">{post.engagement.replies}</strong> Replies
              </span>
              <span>
                <strong className="text-foreground font-bold">{post.engagement.reposts}</strong> Reposts
              </span>
              <span>
                <strong className="text-foreground font-bold">{post.engagement.bookmarks || 0}</strong> Bookmarks
              </span>
            </div>

            {/* Action buttons (Like, Repost, Bookmark, Share) */}
            <div className="flex items-center justify-around text-muted-foreground pt-1">
              {/* Like */}
              <button
                type="button"
                onClick={() => onLikePost(post.id)}
                className={cn(
                  'flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-500/10 transition-colors',
                  isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
                )}
              >
                <Heart className={cn('h-4 w-4', isLiked && 'fill-rose-500 text-rose-500')} />
                <span className="text-xs">{post.engagement.likes}</span>
              </button>

              {/* Repost */}
              <button
                type="button"
                onClick={() => onRepostPost(post.id)}
                className={cn(
                  'flex items-center gap-1.5 p-2 rounded-lg hover:bg-emerald-500/10 transition-colors',
                  isReposted ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                )}
              >
                <Repeat className="h-4 w-4" />
                <span className="text-xs">{post.engagement.reposts}</span>
              </button>

              {/* Bookmark */}
              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={cn(
                  'flex items-center gap-1.5 p-2 rounded-lg hover:bg-primary/10 transition-colors',
                  isBookmarked ? 'text-primary font-bold' : 'hover:text-primary'
                )}
              >
                <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-primary text-primary')} />
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleCopyShare}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors relative"
              >
                <Share2 className="h-4 w-4" />
                {copiedLink && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-0.5 rounded shadow">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Reply composer box */}
          <div className="rounded-xl border border-border/80 bg-card/40 p-3.5 space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Replying to <span className="text-primary font-semibold">{post.handle}</span></span>
            </div>

            {isWalletConnected ? (
              <form onSubmit={handlePostReply} className="space-y-2.5">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Post your reply or counter-thesis..."
                  className="w-full bg-background/50 border border-border rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {500 - replyText.length} chars left
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting || !replyText.trim()}
                    className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="h-3 w-3" /> Reply
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs text-muted-foreground">Connect your wallet to join this conversation</p>
                <button
                  type="button"
                  onClick={onOpenWalletModal}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1"
                >
                  <Wallet className="h-3 w-3" /> Connect
                </button>
              </div>
            )}
          </div>

          {/* Comments list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Replies ({comments.length})
            </h4>

            {loading ? (
              <div className="p-6 text-center text-xs text-muted-foreground font-mono animate-pulse">
                Loading discussion thread...
              </div>
            ) : comments.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground font-mono border border-dashed border-border rounded-xl">
                No replies yet. Be the first to share your perspective!
              </div>
            ) : (
              comments.map((comment) => {
                const commentLiked = currentUserAddress
                  ? comment.likedBy?.includes(currentUserAddress)
                  : false;

                return (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl border border-border/70 bg-card/40 hover:bg-card/70 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onOpenProfile(comment.handle)}
                        className="flex items-center gap-2.5 text-left group"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-xs text-foreground group-hover:ring-1 group-hover:ring-primary transition-all">
                          {comment.author.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {comment.author}
                            </span>
                            {comment.verified && (
                              <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground font-mono">{comment.handle}</span>
                        </div>
                      </button>

                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(comment.postedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-foreground/90 pl-10 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 pl-10 pt-1 text-xs text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => handleLikeComment(comment.id)}
                        className={cn(
                          'flex items-center gap-1 hover:text-rose-500 transition-colors',
                          commentLiked && 'text-rose-500 font-bold'
                        )}
                      >
                        <Heart className={cn('h-3.5 w-3.5', commentLiked && 'fill-rose-500 text-rose-500')} />
                        <span className="text-[11px]">{comment.likes}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReplyToUser(comment.handle)}
                        className="flex items-center gap-1 hover:text-primary transition-colors text-[11px]"
                      >
                        <CornerDownRight className="h-3.5 w-3.5" /> Reply
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
