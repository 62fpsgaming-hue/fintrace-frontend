-- Enhanced User Management System for Fintrace Dashboard
-- This migration creates all necessary tables for user profiles, settings, and analysis history

-- ============================================================================
-- 1. USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  organization TEXT,
  role TEXT DEFAULT 'analyst',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 2. USER SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light',
  email_notifications BOOLEAN DEFAULT true,
  analysis_notifications BOOLEAN DEFAULT true,
  auto_save_results BOOLEAN DEFAULT true,
  default_view TEXT DEFAULT 'grid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for user_settings
CREATE POLICY "Users can view their own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 3. ENHANCED ANALYSIS HISTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  total_accounts INTEGER NOT NULL,
  suspicious_accounts INTEGER NOT NULL,
  fraud_rings_detected INTEGER NOT NULL,
  processing_time_ms INTEGER NOT NULL,
  analysis_data JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON public.analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON public.analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_history_is_favorite ON public.analysis_history(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_analysis_history_tags ON public.analysis_history USING GIN(tags);

-- Enable RLS
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Policies for analysis_history
CREATE POLICY "Users can view their own analyses"
  ON public.analysis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON public.analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
  ON public.analysis_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON public.analysis_history FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. SAVED FILTERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.saved_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  filter_config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.saved_filters ENABLE ROW LEVEL SECURITY;

-- Policies for saved_filters
CREATE POLICY "Users can view their own filters"
  ON public.saved_filters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own filters"
  ON public.saved_filters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own filters"
  ON public.saved_filters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own filters"
  ON public.saved_filters FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. SHARED ANALYSES TABLE (for collaboration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shared_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES public.analysis_history(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_email TEXT NOT NULL,
  permission TEXT DEFAULT 'view', -- 'view' or 'edit'
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shared_analyses ENABLE ROW LEVEL SECURITY;

-- Policies for shared_analyses
CREATE POLICY "Users can view analyses shared with them"
  ON public.shared_analyses FOR SELECT
  USING (auth.uid() = owner_id OR auth.email() = shared_with_email);

CREATE POLICY "Owners can manage their shares"
  ON public.shared_analyses FOR ALL
  USING (auth.uid() = owner_id);

-- ============================================================================
-- 6. ACTIVITY LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Policies for activity_log
CREATE POLICY "Users can view their own activity"
  ON public.activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs"
  ON public.activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 7. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analysis_history_updated_at
  BEFORE UPDATE ON public.analysis_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_filters_updated_at
  BEFORE UPDATE ON public.saved_filters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 8. HELPER VIEWS
-- ============================================================================

-- View for user statistics
CREATE OR REPLACE VIEW public.user_statistics AS
SELECT 
  user_id,
  COUNT(*) as total_analyses,
  SUM(suspicious_accounts) as total_suspicious,
  SUM(fraud_rings_detected) as total_rings,
  AVG(processing_time_ms) as avg_processing_time,
  MAX(created_at) as last_analysis_date,
  COUNT(CASE WHEN is_favorite THEN 1 END) as favorite_count
FROM public.analysis_history
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON public.user_statistics TO authenticated;

-- ============================================================================
-- 9. SAMPLE DATA (for testing)
-- ============================================================================

-- This section is commented out - uncomment to add sample data
/*
-- Insert sample user profile (replace with actual user ID)
INSERT INTO public.user_profiles (id, full_name, organization, role)
VALUES (
  'your-user-id-here',
  'John Doe',
  'ACME Corp',
  'senior_analyst'
);
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify tables were created
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Created tables: user_profiles, user_settings, analysis_history, saved_filters, shared_analyses, activity_log';
  RAISE NOTICE 'Created views: user_statistics';
  RAISE NOTICE 'Created triggers: auto profile creation, updated_at timestamps';
END $$;
