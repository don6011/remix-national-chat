-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.app_role AS ENUM (
  'user', 'verified_user', 'host', 'state_reporter',
  'moderator', 'admin', 'super_admin'
);

CREATE TYPE public.report_status AS ENUM (
  'pending', 'approved', 'rejected', 'flagged', 'removed'
);

CREATE TYPE public.message_status AS ENUM (
  'visible', 'hidden', 'flagged', 'removed'
);

CREATE TYPE public.flag_target_type AS ENUM (
  'message', 'report', 'user', 'room', 'comment'
);

CREATE TYPE public.flag_status AS ENUM (
  'open', 'reviewing', 'resolved', 'dismissed'
);

-- ============================================================
-- SHARED TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  home_state TEXT,
  current_state TEXT,
  bio TEXT,
  rank TEXT NOT NULL DEFAULT 'Citizen',
  influence_score INTEGER NOT NULL DEFAULT 0,
  host_rank TEXT NOT NULL DEFAULT 'Host',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  interests TEXT[] NOT NULL DEFAULT '{}',
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- USER ROLES (separate table — security)
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECURITY DEFINER HELPERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles public.app_role[])
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = ANY(_roles)
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_moderator_or_above(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('moderator', 'admin', 'super_admin')
  )
$$;

-- ============================================================
-- PROFILE + DEFAULT ROLE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1) || '_' || substring(NEW.id::text, 1, 6))
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- PROFILES — RLS
-- ============================================================
CREATE POLICY "Profiles are publicly readable"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================
-- USER ROLES — RLS
-- ============================================================
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- STATES
-- ============================================================
CREATE TABLE public.states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  theme TEXT,
  hero_image_url TEXT,
  active_topic TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.states TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.states TO authenticated;
GRANT ALL ON public.states TO service_role;

ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_states_updated_at
BEFORE UPDATE ON public.states
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "States are publicly readable"
ON public.states FOR SELECT USING (true);

CREATE POLICY "Admins can manage states"
ON public.states FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- ROOMS
-- ============================================================
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_code TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  venue_type TEXT,
  description TEXT,
  host_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.rooms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rooms TO authenticated;
GRANT ALL ON public.rooms TO service_role;

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Rooms are publicly readable when not archived"
ON public.rooms FOR SELECT
USING (is_archived = false OR public.is_moderator_or_above(auth.uid()));

CREATE POLICY "Hosts can create rooms"
ON public.rooms FOR INSERT
WITH CHECK (
  auth.uid() = host_user_id
  AND public.has_any_role(auth.uid(), ARRAY['host', 'admin', 'super_admin']::public.app_role[])
);

CREATE POLICY "Hosts can update their own rooms"
ON public.rooms FOR UPDATE
USING (auth.uid() = host_user_id);

CREATE POLICY "Admins can manage all rooms"
ON public.rooms FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (length(body) > 0 AND length(body) <= 2000),
  status public.message_status NOT NULL DEFAULT 'visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_room_created ON public.messages(room_id, created_at DESC);
CREATE INDEX idx_messages_user ON public.messages(user_id);

GRANT SELECT ON public.messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Visible messages are public"
ON public.messages FOR SELECT
USING (status = 'visible' OR public.is_moderator_or_above(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Authenticated users can post messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their own messages"
ON public.messages FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Moderators can update message status"
ON public.messages FOR UPDATE
USING (public.is_moderator_or_above(auth.uid()));

CREATE POLICY "Admins can delete messages"
ON public.messages FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================
-- REACTIONS
-- ============================================================
CREATE TABLE public.reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);

GRANT SELECT ON public.reactions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reactions TO authenticated;
GRANT ALL ON public.reactions TO service_role;

ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions are public"
ON public.reactions FOR SELECT USING (true);

CREATE POLICY "Users can add their own reactions"
ON public.reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions"
ON public.reactions FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- CITIZEN REPORTS
-- ============================================================
CREATE TABLE public.citizen_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caption TEXT NOT NULL CHECK (length(caption) > 0 AND length(caption) <= 500),
  video_url TEXT,
  thumbnail_url TEXT,
  city TEXT,
  state_code TEXT,
  venue_type TEXT,
  mood TEXT,
  activity TEXT,
  ai_tags TEXT[] NOT NULL DEFAULT '{}',
  views INTEGER NOT NULL DEFAULT 0,
  status public.report_status NOT NULL DEFAULT 'pending',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_status_created ON public.citizen_reports(status, created_at DESC);
CREATE INDEX idx_reports_user ON public.citizen_reports(user_id);
CREATE INDEX idx_reports_state ON public.citizen_reports(state_code);

GRANT SELECT ON public.citizen_reports TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.citizen_reports TO authenticated;
GRANT ALL ON public.citizen_reports TO service_role;

ALTER TABLE public.citizen_reports ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_reports_updated_at
BEFORE UPDATE ON public.citizen_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Approved reports are public"
ON public.citizen_reports FOR SELECT
USING (status = 'approved' OR user_id = auth.uid() OR public.is_moderator_or_above(auth.uid()));

CREATE POLICY "Verified users can upload reports"
ON public.citizen_reports FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND public.has_any_role(auth.uid(), ARRAY['verified_user', 'state_reporter', 'host', 'moderator', 'admin', 'super_admin']::public.app_role[])
);

CREATE POLICY "Users can update their own reports"
ON public.citizen_reports FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Moderators can update report status"
ON public.citizen_reports FOR UPDATE
USING (public.is_moderator_or_above(auth.uid()));

CREATE POLICY "Admins can delete reports"
ON public.citizen_reports FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================
-- REPORT REACTIONS
-- ============================================================
CREATE TABLE public.report_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.citizen_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL DEFAULT '❤',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (report_id, user_id, emoji)
);

GRANT SELECT ON public.report_reactions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_reactions TO authenticated;
GRANT ALL ON public.report_reactions TO service_role;

ALTER TABLE public.report_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Report reactions are public"
ON public.report_reactions FOR SELECT USING (true);

CREATE POLICY "Users can add their own report reactions"
ON public.report_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own report reactions"
ON public.report_reactions FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- REPORT COMMENTS
-- ============================================================
CREATE TABLE public.report_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.citizen_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (length(body) > 0 AND length(body) <= 1000),
  status public.message_status NOT NULL DEFAULT 'visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_report_comments_report ON public.report_comments(report_id, created_at DESC);

GRANT SELECT ON public.report_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_comments TO authenticated;
GRANT ALL ON public.report_comments TO service_role;

ALTER TABLE public.report_comments ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_report_comments_updated_at
BEFORE UPDATE ON public.report_comments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Visible report comments are public"
ON public.report_comments FOR SELECT
USING (status = 'visible' OR public.is_moderator_or_above(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Authenticated users can comment on reports"
ON public.report_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their own comments"
ON public.report_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Moderators can update comment status"
ON public.report_comments FOR UPDATE
USING (public.is_moderator_or_above(auth.uid()));

CREATE POLICY "Admins can delete comments"
ON public.report_comments FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================
-- MODERATION FLAGS
-- ============================================================
CREATE TABLE public.moderation_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type public.flag_target_type NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (length(reason) > 0 AND length(reason) <= 500),
  status public.flag_status NOT NULL DEFAULT 'open',
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_flags_status ON public.moderation_flags(status, created_at DESC);
CREATE INDEX idx_flags_target ON public.moderation_flags(target_type, target_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.moderation_flags TO authenticated;
GRANT ALL ON public.moderation_flags TO service_role;

ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_flags_updated_at
BEFORE UPDATE ON public.moderation_flags
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Authenticated users can submit flags"
ON public.moderation_flags FOR INSERT
WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Users can view their own flags"
ON public.moderation_flags FOR SELECT
USING (auth.uid() = reporter_user_id);

CREATE POLICY "Moderators can view all flags"
ON public.moderation_flags FOR SELECT
USING (public.is_moderator_or_above(auth.uid()));

CREATE POLICY "Moderators can manage flags"
ON public.moderation_flags FOR UPDATE
USING (public.is_moderator_or_above(auth.uid()));

CREATE POLICY "Admins can delete flags"
ON public.moderation_flags FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================
-- ADMIN ACTIONS (AUDIT LOG)
-- ============================================================
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_actions_created ON public.admin_actions(created_at DESC);
CREATE INDEX idx_admin_actions_admin ON public.admin_actions(admin_user_id);

GRANT SELECT, INSERT ON public.admin_actions TO authenticated;
GRANT ALL ON public.admin_actions TO service_role;

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
ON public.admin_actions FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert audit entries"
ON public.admin_actions FOR INSERT
WITH CHECK (
  auth.uid() = admin_user_id
  AND public.is_moderator_or_above(auth.uid())
);

-- ============================================================
-- LIVE SIGNALS (Hot / Trending / Fastest Growing overrides)
-- ============================================================
CREATE TABLE public.live_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_type TEXT NOT NULL,
  label TEXT NOT NULL,
  subtitle TEXT,
  state_code TEXT,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  metric_value TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_live_signals_type ON public.live_signals(signal_type, sort_order);

GRANT SELECT ON public.live_signals TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_signals TO authenticated;
GRANT ALL ON public.live_signals TO service_role;

ALTER TABLE public.live_signals ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_live_signals_updated_at
BEFORE UPDATE ON public.live_signals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Live signals are publicly readable"
ON public.live_signals FOR SELECT USING (true);

CREATE POLICY "Admins can manage live signals"
ON public.live_signals FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- STATE INTELLIGENCE (pre-existing) — add write policies for admins
-- ============================================================
GRANT SELECT ON public.state_intelligence TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.state_intelligence TO authenticated;
GRANT ALL ON public.state_intelligence TO service_role;

CREATE POLICY "Admins can manage state intelligence"
ON public.state_intelligence FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));