
CREATE TABLE public.state_intelligence (
  state_code TEXT PRIMARY KEY,
  primary_topic TEXT NOT NULL,
  secondary_topic TEXT,
  activity_level TEXT NOT NULL,
  mood TEXT NOT NULL,
  rival_state TEXT,
  momentum_score INTEGER NOT NULL DEFAULT 0,
  trending_reason TEXT,
  top_venue TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.state_intelligence TO anon;
GRANT SELECT ON public.state_intelligence TO authenticated;
GRANT ALL ON public.state_intelligence TO service_role;

ALTER TABLE public.state_intelligence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "State intelligence is publicly readable"
ON public.state_intelligence
FOR SELECT
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.state_intelligence;
ALTER TABLE public.state_intelligence REPLICA IDENTITY FULL;
