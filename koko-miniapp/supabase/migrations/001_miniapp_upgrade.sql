-- ============================================================
-- Koko Mini App — DB Migration
-- Run in Supabase SQL Editor
-- These are ADDITIVE only — nothing existing is removed.
-- ============================================================

-- 1. Add new columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS suspicious_score      SMALLINT  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_depth        SMALLINT  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shadow_mode_active    BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shadow_mode_expires   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS daily_actions_count   SMALLINT  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_action_date      DATE,
  ADD COLUMN IF NOT EXISTS referral_pts_earned   INTEGER   NOT NULL DEFAULT 0;

-- 2. Create leaderboard view (fair — excludes suspicious + zero-task users)
CREATE OR REPLACE VIEW leaderboard_public AS
SELECT
  telegram_id,
  username,
  first_name,
  points,
  tokens_allocated,
  RANK() OVER (ORDER BY points DESC) AS rank
FROM users
WHERE
  is_suspicious = false
  AND (joined_telegram OR followed_x OR retweeted OR lore_answered)
  AND points > 0
ORDER BY points DESC
LIMIT 100;

-- Grant public read on leaderboard
GRANT SELECT ON leaderboard_public TO anon;
GRANT SELECT ON leaderboard_public TO authenticated;

-- 3. RLS policies for Mini App (read-only access)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies if any
DROP POLICY IF EXISTS "miniapp_read_own" ON users;

-- Users can only read their own row (Mini App uses this)
-- The telegram_id is passed via app.telegram_id setting from the Edge Function
CREATE POLICY "miniapp_read_own"
  ON users FOR SELECT
  USING (true); -- Adjust to: telegram_id = current_setting('app.telegram_id', true)::bigint when using proper JWT

-- 4. RPC: Increment referral_pts_earned (add to existing increment_points_by_id if needed)
CREATE OR REPLACE FUNCTION increment_referral_pts(tid BIGINT, pts INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users
  SET
    points = points + pts,
    referral_pts_earned = referral_pts_earned + pts
  WHERE telegram_id = tid
    AND is_suspicious = false;
END;
$$;

-- 5. Daily action reset function (call via cron or pg_cron)
CREATE OR REPLACE FUNCTION reset_daily_actions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users
  SET daily_actions_count = 0
  WHERE last_action_date < CURRENT_DATE;
END;
$$;

-- 6. Suspicious score recalculation (run periodically)
CREATE OR REPLACE FUNCTION recalculate_suspicious_scores()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users SET suspicious_score = (
    -- No username
    CASE WHEN username IS NULL THEN 1 ELSE 0 END
    -- Account too new (created_at < 7 days ago)
    + CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END
    -- Referral ratio > 85% of total points
    + CASE WHEN points > 500 AND referral_pts_earned::float / NULLIF(points, 0) > 0.85 THEN 2 ELSE 0 END
    -- Duplicate wallet already caught elsewhere
    + CASE WHEN suspicious_reason = 'duplicate_wallet' THEN 2 ELSE 0 END
    -- Rapid referrals already caught
    + CASE WHEN suspicious_reason = 'rapid_referrals' THEN 2 ELSE 0 END
  );

  -- Auto-flag users with score >= 3
  UPDATE users
  SET is_suspicious = true,
      suspicious_reason = COALESCE(suspicious_reason, 'auto_score_threshold')
  WHERE suspicious_score >= 3
    AND is_suspicious = false;
END;
$$;

-- Schedule recalculation daily (requires pg_cron extension)
-- SELECT cron.schedule('0 3 * * *', 'SELECT recalculate_suspicious_scores()');
-- SELECT cron.schedule('0 0 * * *', 'SELECT reset_daily_actions()');

-- 7. Index for leaderboard performance
CREATE INDEX IF NOT EXISTS idx_users_points_desc
  ON users (points DESC)
  WHERE is_suspicious = false;

CREATE INDEX IF NOT EXISTS idx_users_referral_code
  ON users (referral_code);
